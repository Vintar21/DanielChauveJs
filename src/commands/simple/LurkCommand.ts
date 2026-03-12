import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "lurk";

const options: CommandOptions = new CommandOptions(["lurking"]);
const answer: String = `Bon lurk à toi !`;

export default class DiscordCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
