import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "gustave";

const options: CommandOptions = new CommandOptions([]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Gustave: https://ibb.co/QjdvVvt5 🎨";

export default class GustaveCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
