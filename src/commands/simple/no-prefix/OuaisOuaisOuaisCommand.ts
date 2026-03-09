import CommandOptions from "../../options/CommandOptions";
import NoPrefixSimpleCommand from "../../templates/NoPrefixSimpleCommand";

const options: CommandOptions = new CommandOptions([/(oua(is?|é|e)\s*){3}/i]);

const answer: String = "Ouais ouais ouais !!";

export default class OuaisOuaisOuaisCommand extends NoPrefixSimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
