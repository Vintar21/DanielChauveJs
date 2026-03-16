import { ChatMessage } from "@twurple/chat";
import { Placeholders } from "../../utils/CommandsUtils";
import { EMPTY, SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import MultipleAnswersCommand from "./MultipleAnswersCommand";

export default class DilemmaCommand extends MultipleAnswersCommand {
  private possibilities: String[];

  constructor(
    name: string,
    options: CommandOptions,
    possibilities: String[],
    enabled: boolean = true,
  ) {
    options = options.canUseFullMessage();
    super(name, options, [], enabled);
    this.possibilities = possibilities;
  }

  public execute(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ): void {
    this.responses = [];
    const text = chatMessage.text.trim().split(SPACE).slice(1).join(SPACE);
    if (text === EMPTY) {
      this.replyOrSend(
        user,
        chatMessage,
        ignoreCooldowns,
        "Il faut que tu précise quoi parce que sinon on comprend pas... Stare",
      );
      return;
    }
    this.possibilities.forEach((possibility) => {
      this.responses.push(possibility.replaceAll(Placeholders.INPUT, text));
    });
    super.execute(user, chatMessage, ignoreCooldowns);
  }
}
