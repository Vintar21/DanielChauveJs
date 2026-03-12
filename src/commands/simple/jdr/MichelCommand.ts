import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "michel";

const options: CommandOptions = new CommandOptions(["michmich"]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Michel: https://ibb.co/v49xqhWX 🎵";

export default class MichelCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
