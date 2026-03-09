import { switchFriendCode } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/code-?ami/i]);

const answer: String = `​Mon code ami Switch est ${switchFriendCode}`;

export default class SwitchFriendCodeCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
