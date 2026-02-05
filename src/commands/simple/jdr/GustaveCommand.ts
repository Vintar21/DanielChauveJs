import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class GustaveCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions().addTriggers([
    /gustave/i,
  ]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Gustave: https://ibb.co/QjdvVvt5 🎨";

  constructor() {
    super(GustaveCommand.options, GustaveCommand.answer);
  }
}
