import { JDR_PJ_MESSAGE_START } from "../../CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/marta/i]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Marta: https://ibb.co/ymHxJmpS 📚";

export default class MartaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
