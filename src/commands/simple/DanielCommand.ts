import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class DanielCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /daniel(chauve)?/i,
  ]);

  private static answer: string = "Fais pas genre tu sais pas qui jsuis !";

  constructor() {
    super(DanielCommand.options, DanielCommand.answer);
  }
}
