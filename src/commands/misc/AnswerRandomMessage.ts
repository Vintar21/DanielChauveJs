import { MessageEvent } from "@twurple/easy-bot";
import { User } from "../../utils/user/User";
import { Permissions } from "../../utils/permissions/Permissions";
import { getDefaultRolesPermissions, Role, Roles } from "../../utils/RoleUtils";
import CommandOptions from "../options/CommandOptions";
import MultipleAnswersCommand from "../templates/MultipleAnswersCommand";
import { EMPTY } from "../../utils/StringConstants";

const rolesPermissions: Permissions<Role> = getDefaultRolesPermissions();
rolesPermissions.unallow(Roles.BROADCASTER);

const options: CommandOptions = new CommandOptions([/.+/i])
  .dontUsePrefix()
  .setRolesPermission(rolesPermissions);

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
  protected proba: number = 1 / 1000;

  constructor(enabled: boolean = true) {
    super(EMPTY, options, answers, enabled);
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
