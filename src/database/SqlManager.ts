import sql from "msnodesqlv8";
import { QueryAggregatorResults } from "msnodesqlv8/types";
import { canUseSqlBase } from "../app";
import { sqlConnectionString } from "../config/ConfigLoader";
import { UserId } from "../utils/user/User";
import {
  ANNOUNCE_COLUMN,
  CATEGORY_NAME_COLUMN,
  COUNTER_NAME_COLUMN,
  COUNTER_VALUE_COLUMN,
  COUNTERS_TABLE,
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
import { EMPTY } from "../utils/StringConstants";
import { log } from "../utils/CommonUtils";

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
      log(`New user inserted: {${userId} | ${username}}`);
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
    log(`Roll added: ${userId} - ${value}`);
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

  public static async updateCounter(
    counterName: string,
    counterValue: number,
    categoryName: string | undefined,
  ) {
    categoryName = categoryName ?? EMPTY;
    const whereCondition = `WHERE ${COUNTER_NAME_COLUMN}='${counterName}' AND ${CATEGORY_NAME_COLUMN}='${categoryName}'`;
    const query = `
    IF NOT EXISTS(SELECT * FROM ${COUNTERS_TABLE} ${whereCondition})
	    BEGIN
		    INSERT INTO ${COUNTERS_TABLE} (${COUNTER_NAME_COLUMN}, ${COUNTER_VALUE_COLUMN}, ${CATEGORY_NAME_COLUMN}) VALUES ('${counterName}', ${counterValue}, '${categoryName}')
    	END;
    ELSE
	    BEGIN
		    UPDATE ${COUNTERS_TABLE} SET ${COUNTER_VALUE_COLUMN} = ${counterValue} ${whereCondition}
	    END;`;
    const queryAgregator = await SqlManager.executeQuery(query);
    log(
      `Counter added/updated: ${counterName}:${categoryName} - ${counterValue}`,
    );
    return queryAgregator;
  }

  public static async getCounterValue(
    counterName: string,
    categoryName: string | undefined,
  ): Promise<number | undefined> {
    categoryName = categoryName ?? EMPTY;
    const whereCondition = `WHERE ${COUNTER_NAME_COLUMN}='${counterName}' AND ${CATEGORY_NAME_COLUMN}='${categoryName}'`;
    const query = `SELECT ${COUNTER_VALUE_COLUMN} FROM ${COUNTERS_TABLE} ${whereCondition}`;
    const queryAgregator = await SqlManager.executeQuery(query);
    const counterValueResult = SqlManager.isValideQueryAgregator(queryAgregator)
      ? queryAgregator[FIRST]
      : undefined;
    if (counterValueResult?.length > 0) {
      const counterValue = Number(counterValueResult[0]?.counter_value);
      return isNaN(counterValue) ? undefined : counterValue;
    }
    return undefined;
  }

  public static async getAllCounterValues(
    counterName: string,
  ): Promise<Map<string, number> | undefined> {
    const whereCondition = `WHERE ${COUNTER_NAME_COLUMN}='${counterName}'`;
    const query = `SELECT ${CATEGORY_NAME_COLUMN}, ${COUNTER_VALUE_COLUMN} FROM ${COUNTERS_TABLE} ${whereCondition}`;
    const queryAgregator = await SqlManager.executeQuery(query);
    const rows = SqlManager.isValideQueryAgregator(queryAgregator)
      ? queryAgregator[FIRST]
      : undefined;
    // [{category_name: string, counter_value: number}, {category_name: string, counter_value: number},...]
    if (rows?.length > 0) {
      const categoriesValuesMap: Map<string, number> = new Map();
      rows.forEach((row) =>
        categoriesValuesMap.set(row.category_name, row.counter_value),
      );
      return categoriesValuesMap;
    }
    return undefined;
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
        log("SQL ERROR: " + err.message);
      }
    }
  }
}
