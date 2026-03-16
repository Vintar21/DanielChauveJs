import { addRollMessageCommand } from "./commands/AddRollMessageCommand";
import { liveCommand } from "./commands/LiveCommand";
import { rollBg3ServCommand } from "./commands/RollBg3ServCommand";
import { sayCommand } from "./commands/SayCommand";
import { sqlCommand } from "./commands/SqlCommand";
import ADiscordCommand from "./commands/templates/ADiscordCommand";

export const twitchRelatedDiscordCommands: ADiscordCommand[] = [
  sayCommand,
  liveCommand,
  sqlCommand,
  addRollMessageCommand,
];

export const jdrRelatedDiscordCommands: ADiscordCommand[] = [
  rollBg3ServCommand,
];

export const allDiscordCommands: ADiscordCommand[] = [
  ...twitchRelatedDiscordCommands,
  ...jdrRelatedDiscordCommands,
];
