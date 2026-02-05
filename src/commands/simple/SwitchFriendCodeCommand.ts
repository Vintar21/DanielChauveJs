import CommandOptions from "../CommandOptions";
import SimpleCommand from "../SimpleCommand";

export default class SwitchFriendCodeCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/code-?ami/i]);

  private static answer: string = "​Mon code ami Switch est SW-7448-5566-7296";

  constructor() {
    super(SwitchFriendCodeCommand.options, SwitchFriendCodeCommand.answer);
  }
}
