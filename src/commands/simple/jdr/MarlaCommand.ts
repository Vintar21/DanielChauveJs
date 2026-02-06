import { JDR_PJ_MESSAGE_START } from "../../CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/marla/i]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Marla: https://ibb.co/tTfScb5X 🔎";

export default class MarlaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
