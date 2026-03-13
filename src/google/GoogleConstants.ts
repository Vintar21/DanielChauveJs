export const SPREADSHEET_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Counters
export const COUNTERS_SHEET = "Counters";

export const FIRST_COUNTERS_ROW = 2;
export const COUNTERS_VALUE_COLUMN = "C";
export const COUNTERS_RANGE = `A${FIRST_COUNTERS_ROW}:C`;

// Commands
export const GSheetCommandRoles = Object.freeze({
  FOLLOWER: "Follower",
  SUB: "Sub",
  VIP: "VIP",
  MOD: "Moderator",
  BROADCASTER: "Broadcaster",
  EVERYONE: "Everyone",
});

// ----- Simple Commands
export const SIMPLE_COMMANDS_SHEET = "Simple Commands";
export const SIMPLE_COMMANDS_NUMBER_CELL = "Z2";
export const SIMPLE_COMMANDS_RANGE = "A2:N";

// ----- Counter Commands
export const COUNTER_COMMANDS_SHEET = "Counters Commands";
