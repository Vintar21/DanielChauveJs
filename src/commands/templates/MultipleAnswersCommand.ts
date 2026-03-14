import { MessageEvent } from "@twurple/easy-bot";
import { User } from "../../utils/user/User";
import { choose } from "../../utils/CommonUtils";
import ACommand from "./ACommand";
import CommandOptions from "../options/CommandOptions";

export default class MultipleAnswersCommand extends ACommand {
  protected responses: string[];

  constructor(
    name: string,
    options: CommandOptions,
    responses: string[],
    enabled: boolean = true,
  ) {
    super(name, options, enabled);
    this.responses = responses;
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    this.replyOrSend(user, event, ignoreCooldowns, choose(this.responses));
  }

  public getAnswers(): string[] {
    return this.responses;
  }
}
