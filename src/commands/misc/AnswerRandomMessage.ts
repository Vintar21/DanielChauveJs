import User from "../../user/User";
import { Roles } from "../../utils/RoleUtils";
import CommandOptions from "../CommandOptions";
import MultipleAnswersCommand from "../MultipleAnswersCommand";
import { MessageEvent } from "@twurple/easy-bot/lib";

export default class AnswerRandomMessage extends MultipleAnswersCommand {
  protected proba: number = 3000;

  private static answers: String[] = [
    "J'en ai vu des avis désastreux mais alors celui-ci...",
    "Les TERMES !",
    "Ca intéresse qui ?",
    "LUL grave marrant ça !",
    ".............",
    "Mdrr tu dis ça à chaque fois !",
  ];

  private static options: CommandOptions = new CommandOptions([/.+/i])
    .dontUsePrefix()
    .setUnallowedRole(Roles.BROADCASTER);

  constructor() {
    super(AnswerRandomMessage.options, AnswerRandomMessage.answers);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    console.log("Triggered:" + 1 / this.proba);
    if (Math.random() < 1 / this.proba) {
      super.execute(user, event, ignoreCooldowns);
    }
  }
}
