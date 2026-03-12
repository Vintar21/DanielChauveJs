import { sayCommand } from "./commands/SayCommand";
import { liveCommand } from "./commands/LiveCommand";
import ADiscordCommand from "./commands/ADiscordCommand";

export const twitchRelatedDiscordCommands: ADiscordCommand[] = [
  sayCommand,
  liveCommand,
];
