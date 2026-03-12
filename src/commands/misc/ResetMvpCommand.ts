import { MessageEvent } from "@twurple/easy-bot";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { undefinedUser, User } from "../../utils/user/User";
import { rollCommand } from "../AllCommands";
import CommandOptions from "../options/CommandOptions";
import ACommand from "../templates/ACommand";

const mainTrigger: string = "reset";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions(["resetMvp", "reset-mvp"])
  .setRolesPermission(rolesPermissions)
  .disable();

//TODO: arg of !roll not a full command
export default class ResetMvpCommand extends ACommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    const currentMvp = rollCommand.getCurrentMvp();
    if (currentMvp.user === undefinedUser && currentMvp.score === 0) {
      this.replyOrSend(
        user,
        event,
        true,
        "Calmos, y a même pas encore de MVP cowboy !",
      );
    } else {
      // Reset OBS source and current MVP for the RollCommand
      rollCommand.reset();
      this.replyOrSend(user, event, true, "Le MVP a été reset chef !");
    }
  }
}
