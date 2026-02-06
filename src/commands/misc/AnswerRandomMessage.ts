import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../../user/User";
import { moobotUser } from "../../user/UserConstants";
import { Roles } from "../../utils/RoleUtils";
import CommandOptions from "../CommandOptions";
import MultipleAnswersCommand from "../templates/MultipleAnswersCommand";

const options: CommandOptions = new CommandOptions([/.+/i])
  .dontUsePrefix()
  .setUnallowedRole(Roles.BROADCASTER)
  .setUnallowedUser(moobotUser.userId);

const answers: String[] = [
  "J'en ai vu des avis désastreux mais alors celui-ci...",
  "Les TERMES !",
  "Ca intéresse qui ?",
  "LUL grave marrant ça !",
  ".............",
  "Mdrr tu dis ça à chaque fois !",
  "Et donc ça, ça te fait rire ?",
];
export default class AnswerRandomMessage extends MultipleAnswersCommand {
  protected proba: number = 1 / 3000;

  constructor(enabled: boolean = true) {
    super(options, answers, enabled);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    if (Math.random() < this.proba) {
      super.execute(user, event, ignoreCooldowns);
    }
  }
}
