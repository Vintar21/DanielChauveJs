import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../user/User";
import { choose } from "../utils/CommandsUtils";
import ACommand from "./ACommand";
import CommandOptions from "./CommandOptions";

export default class MultipleAnswersCommand extends ACommand {
  private responses: String[];

  constructor(options: CommandOptions, responses: String[]) {
    super(options);
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
