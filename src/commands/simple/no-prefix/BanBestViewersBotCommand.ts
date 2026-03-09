import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../../../app";
import { getDefaultRolesPermissions, Roles } from "../../../utils/RoleUtils";
import { EMPTY } from "../../../utils/StringConstants";
import { User } from "../../../utils/user/User";
import CommandOptions from "../../options/CommandOptions";
import NoPrefixSimpleCommand from "../../templates/NoPrefixSimpleCommand";

const permissions = getDefaultRolesPermissions();
permissions.unallowAllExcept([Roles.NO_ROLE]);

const options: CommandOptions = new CommandOptions([
  /streamboo/i,
  /(t[o0]p|best)\s*vieweu?rs?\s+[a-z0-9]\.ru/i,
])
  .setRolesPermission(permissions)
  .setMaxUsePerUser(1);

export default class BanBestViewersBotCommand extends NoPrefixSimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, EMPTY, enabled);
  }

  public execute(
    user: User | undefined,
    event: MessageEvent,
    ignoreCooldowns?: boolean,
  ): void {
    // if isFirstMessage
    const twitchClient = MainApp.getTwitchClient();
    twitchClient.getModerationApi().banUser(twitchClient.getBroadcaster(), {
      reason: "Best viewer scam",
      user: event.userId,
    });
  }
}
