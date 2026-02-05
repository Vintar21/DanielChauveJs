import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class MichelCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /mich[eèéê]l(le)?/i,
  ]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Michel: https://ibb.co/v49xqhWX 🎵";

  constructor() {
    super(MichelCommand.options, MichelCommand.answer);
  }
}
