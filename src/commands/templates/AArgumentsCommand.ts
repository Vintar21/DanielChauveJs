import { MessageEvent } from "@twurple/easy-bot";
import { User } from "../../utils/user/User";
import ACommand from "./ACommand";
import { SPACE } from "../../utils/StringConstants";
import CommandOptions from "../options/CommandOptions";

export default abstract class AArgumentsCommand extends ACommand {
  constructor(name: string, options: CommandOptions, enabled: boolean = true) {
    options = options.canUseFullMessage();
    super(name, options, enabled);
  }

  protected parseArgs(event: MessageEvent): String[] {
    return event?.text?.trim()?.split(SPACE)?.slice(1);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    const args: String[] = this.parseArgs(event) ?? [];
    this.executeWithArgs(user, event, args, ignoreCooldowns);
  }

  protected abstract executeWithArgs(
    user: User,
    event: MessageEvent,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void>;
}
