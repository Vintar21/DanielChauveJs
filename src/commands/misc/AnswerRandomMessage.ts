import { ChatMessage } from "@twurple/chat/lib";
import { Permissions } from "../../utils/permissions/Permissions";
import { getDefaultRolesPermissions, Role, Roles } from "../../utils/RoleUtils";
import { EMPTY } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import MultipleAnswersCommand from "../templates/MultipleAnswersCommand";

const rolesPermissions: Permissions<Role> = getDefaultRolesPermissions();
rolesPermissions.unallow(Roles.BROADCASTER);

const options: CommandOptions = new CommandOptions([/.+/i])
  .dontUsePrefix()
  .setRolesPermission(rolesPermissions);

const answers: string[] = [
  "J'en ai vu des avis désastreux mais alors celui-ci...",
  "Les TERMES !",
  "Ca intéresse qui ?",
  "LUL grave marrant ça !",
  ".............",
  "Mdrr tu dis ça à chaque fois !",
  "Et donc ça, ça te fait rire ?",
];
export default class AnswerRandomMessage extends MultipleAnswersCommand {
  protected proba: number = 1 / 1000;

  constructor(enabled: boolean = true) {
    super(EMPTY, options, answers, enabled);
  }

  public execute(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ): void {
    if (Math.random() < this.proba) {
      super.execute(user, chatMessage, ignoreCooldowns);
    }
  }
}
