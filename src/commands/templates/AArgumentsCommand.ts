import { ChatMessage } from "@twurple/chat";
import { SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import ACommand from "./ACommand";

export default abstract class AArgumentsCommand extends ACommand {
  constructor(name: string, options: CommandOptions, enabled: boolean = true) {
    options = options.canUseFullMessage();
    super(name, options, enabled);
  }

  protected parseArgs(message: string): String[] {
    return message?.trim()?.split(SPACE)?.slice(1);
  }

  public execute(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ): void {
    const args: String[] = this.parseArgs(chatMessage?.text) ?? [];
    this.executeWithArgs(user, chatMessage, args, ignoreCooldowns);
  }

  protected abstract executeWithArgs(
    user: User,
    chatMessage: ChatMessage,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void>;
}
