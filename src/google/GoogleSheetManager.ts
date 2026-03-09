import { JWT } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";
import {
  googleApiMail,
  googlePrivateKey,
  googleSpreadSheetId,
} from "../config/ConfigLoader";
import { choose, warn } from "../utils/CommonUtils";
import { EMPTY } from "../utils/StringConstants";
import {
  COUNTERS_RANGE,
  COUNTERS_SHEET,
  COUNTERS_VALUE_COLUMN,
  FIRST_COUNTERS_ROW,
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
    const countersData = await this.getDatas(COUNTERS_SHEET, "A2:C");
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
