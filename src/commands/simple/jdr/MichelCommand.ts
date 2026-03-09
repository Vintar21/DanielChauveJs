import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/mich[eèéê]l(le)?/i]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Michel: https://ibb.co/v49xqhWX 🎵";

export default class MichelCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
