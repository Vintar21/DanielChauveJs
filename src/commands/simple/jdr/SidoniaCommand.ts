import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../SimpleCommand";

export default class SidoniaCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/sidonia/i]);

  private static answer: string =
    JDR_PJ_MESSAGE_START + "Sidonia: https://ibb.co/RGTnMKYT 🦝";

  constructor() {
    super(SidoniaCommand.options, SidoniaCommand.answer);
  }
}
