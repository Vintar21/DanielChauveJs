import { discordLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "discord";

const options: CommandOptions = new CommandOptions([]);
const answer: String = `Ouais y a un discord: ${discordLink}`;

export default class DiscordCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
