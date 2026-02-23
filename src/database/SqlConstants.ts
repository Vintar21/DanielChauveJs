export const FIRST = "first";

// Tables
export const ROLLS_TABLE = "rolls";
export const USERS_TABLE = "users";
export const ROLLS_MESSAGES_TABLE = "rolls_messages";
export const GAME_ANNOUNCES_TABLE = "game_announces";
export const GAMES_TABLE = "games";
export const COUNTERS_TABLE = "counters";

// Columns

//-- Users table
export const ID_COLUMN = "id";
export const USERNAME_COLUMN = "username";

//-- Rolls table
export const USER_ID_COLUMN = "userId";
export const SCORE_COLUMN = "score";
export const DATE_ROLL_COLUMN = "dateRoll";

//-- RollsMessages table
export const ROLL_MESSAGE_COLUMN = "roll_message";
export const PROBA_COLUMN = "proba";
export const RESULT_COLUMN = "result";

//-- GameAnnounces table
// Has also an ID and a PROBA column
export const GAME_ID_COLUMN = "game_id";
export const ANNOUNCE_COLUMN = "announce";

//-- Games table
export const GAME_NAME_COLUMN = "game_name";

//-- Counters table
export const COUNTER_NAME_COLUMN = "counter_name";
export const COUNTER_VALUE_COLUMN = "counter_value";
export const CATEGORY_NAME_COLUMN = "category_name";

// Misc
export const AVG_COLUMN_NAME = "average";
