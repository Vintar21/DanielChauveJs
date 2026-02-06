import { JDR_PJ_MESSAGE_START } from "../../CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/peter/i]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Peter: https://ibb.co/CpTz77tC 🔫";

export default class PeterCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
