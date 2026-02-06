import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/daniel(chauve)?/i]);

const answer: String = "Fais pas genre tu sais pas qui jsuis !";

export default class DanielCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
