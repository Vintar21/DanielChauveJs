import { MessageEvent } from "@twurple/easy-bot";
import User from "../../user/User";
import { choose } from "../../utils/CommonUtils";
import ACommand from "../ACommand";
import CommandOptions from "../CommandOptions";

export default class MultipleAnswersCommand extends ACommand {
  protected responses: String[];

  constructor(
    options: CommandOptions,
    responses: String[],
    enabled: boolean = true,
  ) {
    super(options, enabled);
    this.responses = responses;
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    this.replyOrSend(user, event, ignoreCooldowns, choose(this.responses));
  }
}
