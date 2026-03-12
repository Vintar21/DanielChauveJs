import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "peter";

const options: CommandOptions = new CommandOptions([]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Peter: https://ibb.co/CpTz77tC 🔫";

export default class PeterCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
