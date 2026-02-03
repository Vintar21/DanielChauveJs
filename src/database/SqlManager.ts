import sql from "msnodesqlv8";
import Connection = MsNodeSqlV8.Connection;
import ConnectionPromises = MsNodeSqlV8.ConnectionPromises;
import { _, sqlConnectionString } from "../utils/ImportConstants";
import { QueryAggregatorResults } from "msnodesqlv8/types";

export default class SqlManager {
  private static connection: Promise<Connection> =
    sql.promises.open(sqlConnectionString);

  // Return true if a new user was inserted
  public static async insertNewUserQuery(
    userId: string,
    username: string
  ): Promise<boolean> {
    const queryAgregator = await SqlManager.executeQuery(
      `IF NOT EXISTS(SELECT id FROM users WHERE id=${userId}) BEGIN INSERT INTO users (id, username) VALUES (${userId}, '${username}') END;`
    );
    const inserted: boolean =
      queryAgregator["first"] !== null && queryAgregator["first"].length > 0;
    if (inserted) {
      console.log(`New user inserted: {${userId} | ${username}}`);
    }
    return inserted;
  }

  public static async insertRollValueQuery(
    userId: string,
    value: number
  ): Promise<QueryAggregatorResults> {
    const queryAgregator = await SqlManager.executeQuery(
      `INSERT INTO rolls (userId, score, dateRoll) VALUES (${userId}, ${value}, GETDATE());`
    );
    console.log(`Roll added: ${userId} - ${value}`);
    return queryAgregator;
  }

  public static async getCustomMessagesQuery(value: number): Promise<String[]> {
    const queryAgregator = await SqlManager.executeQuery(
      `SELECT roll_message, proba FROM rolls_messages WHERE result=${value}`
    );
    const customMessages = queryAgregator["first"];
    // No custrom message
    if (
      customMessages === undefined ||
      customMessages.length === 0 ||
      customMessages[0]?.roll_message === null
    ) {
      return [];
    }

    // Return a table with duplicated messages according to their probability
    var availableMessages: String[] = [];
    // TODO create interface for sql datas
    customMessages.forEach((row: any) => {
      for (let i = 0; i < row.proba; i++) {
        availableMessages.push(row.roll_message);
      }
    });
    return availableMessages;
  }

  private static async executeQuery(
    query: string
  ): Promise<QueryAggregatorResults> {
    try {
      const connection: Connection = await SqlManager.connection;
      const promises: ConnectionPromises = connection.promises;
      return await promises.query(query);
    } catch (err) {
      // TODO: handle error properly
      console.log("SQL ERROR: " + err.message);
    }
  }
}
