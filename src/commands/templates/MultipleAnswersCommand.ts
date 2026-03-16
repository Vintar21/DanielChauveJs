import { ChatMessage } from "@twurple/chat";
import { choose } from "../../utils/CommonUtils";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import ACommand from "./ACommand";

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
    chatMessage: ChatMessage,
    ignoreCooldowns?: boolean,
  ): void {
    this.replyOrSend(
      user,
      chatMessage,
      ignoreCooldowns,
      choose(this.responses),
    );
  }

  public getAnswers(): string[] {
    return this.responses;
  }
}
