import { Placeholders } from "../../utils/CommandsUtils";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/lurk(ing)?/i])
  .setReplyToUser(false)
  .hasPlaceholders();
const answer: String = `${Placeholders.USER} disparaît en lurk`;

export default class DiscordCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
