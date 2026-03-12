import CommandOptions from "../../options/CommandOptions";
import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "gianni";

const options: CommandOptions = new CommandOptions([/[gj]iann?i/i]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Gianni: https://ibb.co/mFhskd5n 🇮🇹";

export default class GianniCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
