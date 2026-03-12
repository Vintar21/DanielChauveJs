import CommandOptions from "../../options/CommandOptions";
import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "sidonia";

const options: CommandOptions = new CommandOptions([]);

const answer: String =
  JDR_PJ_MESSAGE_START + "Sidonia: https://ibb.co/RGTnMKYT 🦝";

export default class SidoniaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
