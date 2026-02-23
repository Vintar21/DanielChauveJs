import { MessageEvent } from "@twurple/easy-bot";
import User from "../../utils/user/User";
import ACommand from "../ACommand";
import { SPACE } from "../../utils/StringConstants";
import CommandOptions from "../CommandOptions";

export default abstract class AArgumentsCommand extends ACommand {
  constructor(options: CommandOptions, enabled: boolean = true) {
    options = options.canUseFullMessage();
    super(options, enabled);
  }

  protected parseArgs(event: MessageEvent): String[] {
    return event.text.trim().split(SPACE).slice(1);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    this.parseArgs(event);
    this.executeWithArgs(user, event, this.parseArgs(event), ignoreCooldowns);
  }

  protected abstract executeWithArgs(
    user: User,
    event: MessageEvent,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void>;
}
