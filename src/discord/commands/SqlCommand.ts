import * as fs from "fs";
import { FIRST } from "../../database/SqlConstants";
import SqlManager from "../../database/SqlManager";
import { getModOnlyRolesPermissions } from "../../utils/RoleUtils";
import {
  NEW_LINE,
  PIPE,
  SEMI_COLUMN,
  SKIP_LINE,
  SPACE,
} from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import { DiscordMessage } from "../DiscordConstants";
import DiscordCommandOptions from "./options/DiscordCommandOptions";
import ADiscordCommand from "./templates/ADiscordCommand";
import { error, log } from "../../utils/CommonUtils";

const mainTrigger: string = "sql";

const rolesPermissions = getModOnlyRolesPermissions();

const options = new DiscordCommandOptions([]).setRolesPermission(
  rolesPermissions,
);

class SqlCommand extends ADiscordCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  public async execute(
    message: DiscordMessage,
    user: User,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    const args = this.getArgs(message);
    if (args.length > 0) {
      const sqlQuery = args.join(SPACE);
      const queryAgregator = await SqlManager.executeQuery(sqlQuery);
      const response = SqlManager.isValideQueryAgregator(queryAgregator)
        ? queryAgregator[FIRST]
        : undefined;

      if (response) {
        const tmpFilePath = "./dist/tmpDiscordSqlCommandFile.csv";
        // Create a tmp file to send it through discord
        fs.writeFileSync(tmpFilePath, this.formatForCsv(response), "utf8");
        await this.replyOrSendWithFile(
          message,
          "Voici le résultat de ta requête: ",
          tmpFilePath,
          user,
          ignoreCooldowns,
        );

        // Delete tmp file
        fs.unlinkSync(tmpFilePath);
      }
    }
  }

  private formatForCsv(input: any[]): string {
    var isFirstLine: boolean = true;
    const cleanedData: string[][] = [];
    input.forEach((row) => {
      var rowStr = JSON.stringify(row);
      const parsedRow = [...rowStr.matchAll(/"(.+?)":"?([^,"}]+)"?/gi)];
      if (isFirstLine) {
        const titleRow = parsedRow.map((regexpArray) =>
          regexpArray[1].toString(),
        );
        cleanedData.push(titleRow);
        isFirstLine = false;
      }
      const cleanedRow = parsedRow.map((regexpArray) =>
        regexpArray[2].toString(),
      );
      cleanedData.push(cleanedRow);
    });

    const csvData = cleanedData
      .map((row) => row.join(SEMI_COLUMN))
      .join(SKIP_LINE);
    return csvData;
  }
}

export const sqlCommand = new SqlCommand();
