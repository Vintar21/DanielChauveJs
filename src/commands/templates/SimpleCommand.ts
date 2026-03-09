import { MessageEvent } from "@twurple/easy-bot/lib";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import ACommand from "./ACommand";

export default class SimpleCommand extends ACommand {
  private response: String;

  constructor(
    options: CommandOptions,
    response: String,
    enabled: boolean = true,
  ) {
    super(options, enabled);
    this.response = response;
  }

  public execute(
    user: User = undefined,
    event: MessageEvent,
    ignoreCooldowns: boolean = false,
  ): void {
    this.replyOrSend(user, event, ignoreCooldowns, this.response);
  }
}
