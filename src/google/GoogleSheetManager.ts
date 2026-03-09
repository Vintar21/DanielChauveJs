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
