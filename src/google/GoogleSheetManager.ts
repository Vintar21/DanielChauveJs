import { JWT } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";
import CommandOptions from "../commands/options/CommandOptions";
import MultipleAnswersCommand from "../commands/templates/MultipleAnswersCommand";
import {
  googleApiMail,
  googlePrivateKey,
  googleSpreadSheetId,
} from "../config/ConfigLoader";
import ATwitchClient from "../twitch/ATwitchClient";
import {
  Category,
  getCategoriesPermissions,
} from "../utils/CategoriesConstants";
import { choose, log, warn } from "../utils/CommonUtils";
import {
  getBroadcasterOnlyRolesPermissions,
  getDefaultRolesPermissions,
  getFollowerOnlyRolesPermissions,
  getModOnlyRolesPermissions,
  getSubOnlyRolesPermissions,
  getVipOnlyRolesPermissions,
} from "../utils/RoleUtils";
import {
  COMMA,
  DOUBLE_QUOTE,
  EMPTY,
  SKIP_LINE,
} from "../utils/StringConstants";
import {
  COUNTERS_RANGE,
  COUNTERS_SHEET,
  COUNTERS_VALUE_COLUMN,
  FIRST_COUNTERS_ROW,
  GENERAL_COMMANDS_SHEET,
  GSheetCommandRoles,
  SIMPLE_COMMANDS_NUMBER_CELL,
  SIMPLE_COMMANDS_RANGE,
  SIMPLE_COMMANDS_SHEET,
  SPREADSHEET_SCOPE,
} from "./GoogleConstants";

// TODO: write a method to select a discord announce from GSheet
export default class GoogleSheetManager {
  private scopes: string[] = [SPREADSHEET_SCOPE];
  private client: JWT;
  private sheets: sheets_v4.Sheets;

  constructor() {
    this.client = new JWT({
      email: googleApiMail,
      key: googlePrivateKey,
      scopes: this.scopes,
    });

    this.sheets = google.sheets({ version: "v4", auth: this.client });
  }

  public async getCounterValue(
    counterName: string,
    categoryName: string | undefined,
  ): Promise<number> {
    const countersData = await this.getDatas(COUNTERS_SHEET, COUNTERS_RANGE);
    const counterLine = countersData.find(
      (row) =>
        row[0] === counterName && (!categoryName || row[1] === categoryName),
    );

    if (!counterLine || counterLine.length < 3 || isNaN(Number(counterLine[2])))
      return undefined;

    return Number(counterLine[2]);
  }

  public async updateCounter(
    counterName: string,
    counterValue: number,
    categoryName: string | undefined,
  ) {
    const countersData = await this.getDatas(COUNTERS_SHEET, COUNTERS_RANGE);
    const counterIndex = countersData.findIndex(
      (row) =>
        row[0] === counterName && (!categoryName || row[1] === categoryName),
    );

    // Counters already exists
    if (counterIndex >= 0) {
      // Index + first row number because spreadsheets start to 1
      const range = `'${COUNTERS_SHEET}'!${COUNTERS_VALUE_COLUMN}${counterIndex + FIRST_COUNTERS_ROW}`;
      this.sheets.spreadsheets.values.update({
        spreadsheetId: googleSpreadSheetId,
        range,
        valueInputOption: "RAW",
        requestBody: {
          values: [[counterValue]],
        },
      });
    } else {
      // Else create it
      const range = `'${COUNTERS_SHEET}'!${COUNTERS_RANGE}`;
      this.sheets.spreadsheets.values.append({
        spreadsheetId: googleSpreadSheetId,
        range,
        valueInputOption: "RAW",
        requestBody: {
          values: [[counterName, categoryName ?? EMPTY, counterValue]],
        },
      });
    }
  }

  public async importSimpleCustomCommands(): Promise<void> {
    return this.importSimpleCommands(SIMPLE_COMMANDS_SHEET);
  }

  public async importGeneralCommands(): Promise<void> {
    return this.importSimpleCommands(GENERAL_COMMANDS_SHEET);
  }

  public async importSimpleCommands(sheetName: string): Promise<void> {
    const nbCommands: number = Number(
      await this.getDatas(sheetName, SIMPLE_COMMANDS_NUMBER_CELL),
    );
    const range = SIMPLE_COMMANDS_RANGE + (nbCommands + 1).toString();
    const simpleCommands = await this.getDatas(sheetName, range);
    // For log purpose
    const addedCommands: string[] = [];
    simpleCommands.forEach((row) => {
      const name: string = row[0]?.trim()?.normalize()?.toLowerCase();
      const aliases: string[] = row[1]?.split(SKIP_LINE) ?? [];
      const enabled: boolean = row[2];
      const answers: string[] = row[3]?.split(SKIP_LINE) ?? [];
      const hasPlaceholders: boolean = row[4];
      var categoriesToParse: string = row[5];
      const minRole: string = row[6];
      const globalCooldownInSec: number = row[7];
      const userCooldownInSec: number = row[8];
      const rand1: string[] = row[9]?.split(SKIP_LINE);
      const rand2: string[] = row[10]?.split(SKIP_LINE);
      const rand3: string[] = row[11]?.split(SKIP_LINE);
      const rand4: string[] = row[12]?.split(SKIP_LINE);
      const rand5: string[] = row[13]?.split(SKIP_LINE);

      if (enabled && name) {
        const categories: Category[] = this.parseCategories(categoriesToParse);
        const filteredAliases = aliases
          .map((alias) => alias.trim().normalize().toLowerCase())
          .filter((alias) => alias && alias !== EMPTY);

        const options: CommandOptions = new CommandOptions(filteredAliases);
        // Caution: inline ifs
        if (hasPlaceholders) options.hasPlaceholders();
        if (categories.length > 0)
          options.setCategoriesPermissions(
            getCategoriesPermissions(categories),
          );
        if (globalCooldownInSec) options.setGlobalCooldown(globalCooldownInSec);
        if (userCooldownInSec) options.setUserCooldown(userCooldownInSec);

        // There is a role
        if (minRole && minRole !== EMPTY) {
          switch (minRole) {
            case GSheetCommandRoles.FOLLOWER:
              options.setRolesPermission(getFollowerOnlyRolesPermissions());
              break;
            case GSheetCommandRoles.SUB:
              options.setRolesPermission(getSubOnlyRolesPermissions());
              break;
            case GSheetCommandRoles.VIP:
              options.setRolesPermission(getVipOnlyRolesPermissions());
              break;
            case GSheetCommandRoles.MOD:
              options.setRolesPermission(getModOnlyRolesPermissions());
              break;
            case GSheetCommandRoles.BROADCASTER:
              options.setRolesPermission(getBroadcasterOnlyRolesPermissions());
              break;
            default:
              options.setRolesPermission(getDefaultRolesPermissions());
          }
        }

        // By default MultipleAnswers
        const command = new MultipleAnswersCommand(
          name,
          options,
          answers,
          enabled,
        );
        // Caution: inline ifs
        if (rand1) command.setRandomPart1(rand1);
        if (rand2) command.setRandomPart2(rand2);
        if (rand3) command.setRandomPart3(rand3);
        if (rand4) command.setRandomPart4(rand4);
        if (rand5) command.setRandomPart5(rand5);

        ATwitchClient.commandsManager.addCommand(command);
        addedCommands.push(command.getName());
      }
    });
    log(`Adding Simple Command [${addedCommands}] from GSheet`);
  }

  private parseCategories(categoriesToParse: string): Category[] {
    // At least one category name contains a comma or a special character
    const categories: Category[] = [];
    if (categoriesToParse && categoriesToParse.includes(DOUBLE_QUOTE)) {
      const specialCategories = [
        ...categoriesToParse.matchAll(/"(.+?)"/gi),
      ].map((regexpArray) => regexpArray[1]);
      categoriesToParse = categoriesToParse.replaceAll(/".+?",?/gi, EMPTY);
      specialCategories.forEach((category) => categories.push(category));
    }
    categoriesToParse
      ?.split(COMMA)
      ?.filter((category) => category && category !== EMPTY)
      ?.forEach((category) => categories.push(category));

    return categories;
  }

  public async getRandomWord(
    sheetName: string,
    range: string = "A:A",
  ): Promise<string> {
    const values = await this.getDatas(sheetName, range);

    if (!values) {
      warn(
        `Can't get the specified information from GSheet: ${sheetName} range: ${range}`,
      );
      return EMPTY;
    }

    const randomWord: string = choose(values).toString();
    return randomWord;
  }

  public async getDatas(sheetName: string, range: string) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: googleSpreadSheetId,
      range: `'${sheetName}'!${range}`,
    });

    return response?.data?.values;
  }
}
