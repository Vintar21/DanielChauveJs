import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "marla";

const options: CommandOptions = new CommandOptions([]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Marla: https://ibb.co/tTfScb5X 🔎";

export default class MarlaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
