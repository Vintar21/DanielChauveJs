import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/thelma/i]);

const answer: string =
  JDR_PJ_MESSAGE_START + "Thelma: https://ibb.co/Z6LGH5Q7 📜";
export default class ThelmaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
