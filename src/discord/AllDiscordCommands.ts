import { sayCommand } from "./commands/SayCommand";
import { liveCommand } from "./commands/LiveCommand";
import { rollBg3ServCommand } from "./commands/RollBg3ServCommand";
import ADiscordCommand from "./commands/ADiscordCommand";

export const twitchRelatedDiscordCommands: ADiscordCommand[] = [
  sayCommand,
  liveCommand,
];

export const jdrRelatedDiscordCommands: ADiscordCommand[] = [
  rollBg3ServCommand,
];

export const allDiscordCommands: ADiscordCommand[] = [
  ...twitchRelatedDiscordCommands,
  ...jdrRelatedDiscordCommands,
];
