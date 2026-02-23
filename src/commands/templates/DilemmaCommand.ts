import MultipleAnswersCommand from "./MultipleAnswersCommand";
import CommandOptions from "../CommandOptions";
import User from "../../utils/user/User";
import { MessageEvent } from "@twurple/easy-bot";
import { EMPTY, SPACE } from "../../utils/StringConstants";
import { concatTextWithPunctuation } from "../../utils/CommonUtils";
import { Placeholders } from "../CommandsUtils";

export default class DilemmaCommand extends MultipleAnswersCommand {
  private possibilities: String[];

  constructor(
    options: CommandOptions,
    possibilities: String[],
    enabled: boolean = true,
  ) {
    options = options.canUseFullMessage();
    super(options, [], enabled);
    this.possibilities = possibilities;
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    this.responses = [];
    const text = event.text.trim().split(SPACE).slice(1).join(SPACE);
    if (text === EMPTY) {
      this.replyOrSend(
        user,
        event,
        ignoreCooldowns,
        "Il faut que tu précise quoi parce que sinon on comprend pas... Stare",
      );
      return;
    }
    this.possibilities.forEach((possibility) => {
      this.responses.push(possibility.replaceAll(Placeholders.INPUT, text));
    });
    super.execute(user, event, ignoreCooldowns);
  }
}
