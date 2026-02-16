import sql from "msnodesqlv8";
import { QueryAggregatorResults } from "msnodesqlv8/types";
import { canUseSqlBase } from "../app";
import { sqlConnectionString } from "../config/ConfigLoader";
import { UserId } from "../user/User";
import {
  ANNOUNCE_COLUMN,
  DATE_ROLL_COLUMN,
  FIRST,
  GAME_ANNOUNCES_TABLE,
  GAME_ID_COLUMN,
  GAME_NAME_COLUMN,
  GAMES_TABLE,
  ID_COLUMN,
  PROBA_COLUMN,
  RESULT_COLUMN,
  ROLL_MESSAGE_COLUMN,
  ROLLS_MESSAGES_TABLE,
  ROLLS_TABLE,
  SCORE_COLUMN,
  USER_ID_COLUMN,
  USERNAME_COLUMN,
  USERS_TABLE,
} from "./SqlConstants";
import Connection = MsNodeSqlV8.Connection;
import ConnectionPromises = MsNodeSqlV8.ConnectionPromises;

export default class SqlManager {
  private static connection: Promise<Connection> =
    sql.promises.open(sqlConnectionString);

  // Return true if a new user was inserted
  public static async insertNewUserQuery(
    userId: UserId,
    username: string,
  ): Promise<boolean> {
    const queryAgregator = await SqlManager.executeQuery(
      `IF NOT EXISTS(SELECT ${ID_COLUMN} FROM ${USERS_TABLE} WHERE ${ID_COLUMN}=${userId})
        BEGIN 
          INSERT INTO ${USERS_TABLE} (${ID_COLUMN}, ${USERNAME_COLUMN}) VALUES (${userId}, '${username}')
        END;`,
    );
    const inserted: boolean =
      SqlManager.isValideQueryAgregator(queryAgregator) &&
      queryAgregator[FIRST].length > 0;
    if (inserted) {
      console.log(`New user inserted: {${userId} | ${username}}`);
    }
    return inserted;
  }

  public static async insertRollValueQuery(
    userId: UserId,
    value: number,
  ): Promise<QueryAggregatorResults> {
    const queryAgregator = await SqlManager.executeQuery(
      `INSERT INTO ${ROLLS_TABLE} (${USER_ID_COLUMN}, ${SCORE_COLUMN}, ${DATE_ROLL_COLUMN}) VALUES (${userId}, ${value}, GETDATE());`,
    );
    console.log(`Roll added: ${userId} - ${value}`);
    return queryAgregator;
  }

  // TODO: Can it really be null ?
  private static isValideQueryAgregator(
    queryAgregator: QueryAggregatorResults,
  ): boolean {
    return (
      queryAgregator &&
      queryAgregator !== null &&
      queryAgregator[FIRST] &&
      queryAgregator[FIRST] !== null
    );
  }

  public static async getCustomMessagesQuery(value: number): Promise<String[]> {
    const queryAgregator = await SqlManager.executeQuery(
      `SELECT ${ROLL_MESSAGE_COLUMN}, ${PROBA_COLUMN} FROM ${ROLLS_MESSAGES_TABLE} WHERE ${RESULT_COLUMN}=${value}`,
    );
    const customMessages = SqlManager.isValideQueryAgregator(queryAgregator)
      ? queryAgregator[FIRST]
      : undefined;
    // No custrom message
    if (
      !customMessages ||
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

  public static async getAnnounceMessagesQuery(
    gameName: string,
  ): Promise<string[]> {
    const queryAgregator = await SqlManager.executeQuery(
      `SELECT ${ANNOUNCE_COLUMN}, ${PROBA_COLUMN} FROM ${GAME_ANNOUNCES_TABLE} 
        JOIN ${GAMES_TABLE} ON ${GAMES_TABLE}.${ID_COLUMN}=${GAME_ANNOUNCES_TABLE}.${GAME_ID_COLUMN}
       WHERE ${GAME_NAME_COLUMN}='${gameName}'`,
    );
    const customMessages = SqlManager.isValideQueryAgregator(queryAgregator)
      ? queryAgregator[FIRST]
      : undefined;
    // No custrom message
    if (
      !customMessages ||
      customMessages.length === 0 ||
      customMessages[0]?.roll_message === null
    ) {
      return [];
    }

    // Return a table with duplicated messages according to their probability
    var availableMessages: string[] = [];
    // TODO create interface for sql datas
    customMessages.forEach((row: any) => {
      for (let i = 0; i < row.proba; i++) {
        availableMessages.push(row.announce);
      }
    });
    return availableMessages;
  }

  private static async executeQuery(
    query: string,
  ): Promise<QueryAggregatorResults> {
    if (canUseSqlBase) {
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
}
