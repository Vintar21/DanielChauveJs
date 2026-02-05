import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";
import { discordLink } from "../../utils/ImportConstants";

export default class DiscordCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/discord/i]);
  private static answer: string = `Ouais y a un discord: ${discordLink}`;

  constructor() {
    super(DiscordCommand.options, DiscordCommand.answer);
  }
}
