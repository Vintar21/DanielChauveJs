import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class MarlaCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions().addTriggers([
    /marla/i,
  ]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Marla: https://ibb.co/tTfScb5X 🔎";

  constructor() {
    super(MarlaCommand.options, MarlaCommand.answer);
  }
}
