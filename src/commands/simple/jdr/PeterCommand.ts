import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class PeterCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/peter/i]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Peter: https://ibb.co/CpTz77tC 🔫";

  constructor() {
    super(PeterCommand.options, PeterCommand.answer);
  }
}
