import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../../app";
import { Permissions } from "../../utils/permissions/Permissions";
import { getDefaultRolesPermissions, Role, Roles } from "../../utils/RoleUtils";
import { AT } from "../../utils/StringConstants";
import User from "../../utils/user/User";
import CommandOptions from "../CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";

const rolesPermissions: Permissions<Role> = getDefaultRolesPermissions();
rolesPermissions.unallowEach([Roles.BROADCASTER, Roles.MOD]);

const options: CommandOptions = new CommandOptions([
  /ban/i,
  /banuser/i,
  /to/i,
  /timeout/i,
]).setRolesPermission(rolesPermissions);

export default class FakeBanCommand extends AArgumentsCommand {
  constructor(enabled: boolean = true) {
    super(options, enabled);
  }
  protected executeWithArgs(
    user: User,
    event: MessageEvent,
    args: String[],
    ignoreCooldowns: boolean,
  ): void {
    if (args.length > 0 && user.userId && args[0].length > 1) {
      MainApp.botApp.api.moderation.warnUser(
        MainApp.getBroadcasterId(),
        user.userId,
        `On a tous très envie de ban ${args[0].startsWith(AT) ? args[0].substring(1) : args[0]} mais tu comprends que je ne peux pas te laisser faire ça...`,
      );
    }
  }
}
