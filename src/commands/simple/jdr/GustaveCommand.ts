import { JDR_PJ_MESSAGE_START } from "../../CommandsUtils";
import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/gustave/i]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Gustave: https://ibb.co/QjdvVvt5 🎨";

export default class GustaveCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
