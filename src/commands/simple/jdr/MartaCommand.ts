import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class MartaCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions().addTriggers([
    /marta/i,
  ]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Marta: https://ibb.co/ymHxJmpS 📚";

  constructor() {
    super(MartaCommand.options, MartaCommand.answer);
  }
}
