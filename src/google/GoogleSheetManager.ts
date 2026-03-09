import { JWT } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";
import {
  googleApiMail,
  googlePrivateKey,
  googleSpreadSheetId,
} from "../config/ConfigLoader";
import { sheets } from "googleapis/build/src/apis/sheets";
import { choose, warn } from "../utils/CommonUtils";
import { EMPTY } from "../utils/StringConstants";

export default class GoogleSheetManager {
  private scopes: string[] = ["https://www.googleapis.com/auth/spreadsheets"];
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
    const countersData = await this.getDatas("Counters", "A2:C");
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
    const countersData = await this.getDatas("Counters", "A2:C");
    const counterIndex = countersData.findIndex(
      (row) =>
        row[0] === counterName && (!categoryName || row[1] === categoryName),
    );

    // Counters already exists
    if (counterIndex >= 0) {
      // C is the column of the counter value, index+2 because spreadsheets start to 1 and there's a title line in our case
      const range = `'Counters'!C${counterIndex + 2}`;
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
      const range = `'Counters'!A2:C`;
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

  public async getRandomFruit(): Promise<string> {
    const values = await this.getDatas("Random Words", "A2:A");

    if (!values) {
      warn("Can't get the specified information from GSheet");
      return EMPTY;
    }

    const randomFruit: string = choose(values).toString();
    return randomFruit;
  }

  public async getDatas(sheetName: string, range: string) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: googleSpreadSheetId,
      range: `'${sheetName}'!${range}`,
    });

    return response?.data?.values;
  }
}
