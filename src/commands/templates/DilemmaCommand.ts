import MultipleAnswersCommand from "./MultipleAnswersCommand";
import CommandOptions from "../CommandOptions";
import User from "../../utils/user/User";
import { MessageEvent } from "@twurple/easy-bot";
import { EMPTY, SPACE } from "../../utils/StringConstants";

export type Position = "start" | "end";
export const START_POS: Position = "start";
export const END_POS: Position = "end";

export default class DilemmaCommand extends MultipleAnswersCommand {
  private possibilities: String[];
  private position: Position;

  constructor(
    options: CommandOptions,
    possibilities: String[],
    position: Position = END_POS,
    enabled: boolean = true,
  ) {
    options = options.canUseFullMessage();
    super(options, [], enabled);
    this.possibilities = possibilities;
    this.position = position;
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
      if (this.position === START_POS) {
        this.responses.push(possibility + text);
      } else {
        this.responses.push(
          text.substring(0, 1).toUpperCase() + text.substring(1) + possibility,
        );
      }
    });
    super.execute(user, event, ignoreCooldowns);
  }
}
