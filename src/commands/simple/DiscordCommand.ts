import { discordLink } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class DiscordCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/discord/i]);
  private static answer: string = `Ouais y a un discord: ${discordLink}`;

  constructor() {
    super(DiscordCommand.options, DiscordCommand.answer);
  }
}
