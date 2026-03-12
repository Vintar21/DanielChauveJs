import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "marta";

const options: CommandOptions = new CommandOptions([]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Marta: https://ibb.co/ymHxJmpS 📚";

export default class MartaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
