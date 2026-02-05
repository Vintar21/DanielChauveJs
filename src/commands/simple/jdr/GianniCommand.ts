import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class GianniCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions().addTriggers([
    /[gj]iann?i/i,
  ]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Gianni: https://ibb.co/mFhskd5n 🇮🇹";

  constructor() {
    super(GianniCommand.options, GianniCommand.answer);
  }
}
