import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../../user/User";
import ACommand from "../ACommand";
import CommandOptions from "../CommandOptions";

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
