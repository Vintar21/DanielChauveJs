import { liveCommand } from "./commands/LiveCommand";
import { sayCommand } from "./commands/SayCommand";
import { sqlCommand } from "./commands/SqlCommand";
import ADiscordCommand from "./commands/templates/ADiscordCommand";

export const twitchRelatedDiscordCommands: ADiscordCommand[] = [
  sayCommand,
  liveCommand,
  sqlCommand,
];
