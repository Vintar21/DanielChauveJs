import CommandOptions from "../../CommandOptions";
import NoPrefixSimpleCommand from "../NoPrefixSimpleCommand";

export default class OuaisOuaisOuaisCommand extends NoPrefixSimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /(oua(is?|é|e)\s*){3}/i,
  ]);

  private static answer: string = "Ouais ouais ouais !";

  constructor() {
    super(OuaisOuaisOuaisCommand.options, OuaisOuaisOuaisCommand.answer);
  }
}
