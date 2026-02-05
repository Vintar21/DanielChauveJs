import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class ThelmaCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/thelma/i]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Thelma: https://ibb.co/Z6LGH5Q7 📜";

  constructor() {
    super(ThelmaCommand.options, ThelmaCommand.answer);
  }
}
