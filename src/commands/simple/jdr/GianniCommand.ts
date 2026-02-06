import CommandOptions from "../../CommandOptions";
import { JDR_PJ_MESSAGE_START } from "../../CommandsUtils";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/[gj]iann?i/i]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Gianni: https://ibb.co/mFhskd5n 🇮🇹";

export default class GianniCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
