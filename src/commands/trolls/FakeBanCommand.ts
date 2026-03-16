import { ChatMessage } from "@twurple/chat";
import { MainApp } from "../../app";
import { Permissions } from "../../utils/permissions/Permissions";
import { getDefaultRolesPermissions, Role, Roles } from "../../utils/RoleUtils";
import { AT } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";

const mainTrigger: string = "ban";

const rolesPermissions: Permissions<Role> = getDefaultRolesPermissions();
rolesPermissions.unallowEach([Roles.BROADCASTER, Roles.MOD]);

const options: CommandOptions = new CommandOptions([
  "banUser",
  "to",
  "timeout",
]).setRolesPermission(rolesPermissions);

export default class FakeBanCommand extends AArgumentsCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  protected executeWithArgs(
    user: User,
    chatMessage: ChatMessage,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void> {
    const twitchClient = MainApp.getTwitchClient();
    if (args.length > 0 && user.userId && args[0].length > 1) {
      twitchClient
        .getModerationApi()
        .warnUser(
          twitchClient.getBroadcasterId(),
          user.userId,
          `On a tous très envie de ban ${args[0].startsWith(AT) ? args[0].substring(1) : args[0]} mais tu comprends que je ne peux pas te laisser faire ça...`,
        );
    }
    return;
  }
}
