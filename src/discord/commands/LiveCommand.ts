import { MainApp } from "../../app";
import { getModOnlyRolesPermissions } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import { DiscordMessage } from "../DiscordConstants";
import ADiscordCommand from "./ADiscordCommand";
import DiscordCommandOptions from "./options/DiscordCommandOptions";

const rolesPermissions = getModOnlyRolesPermissions();

const options = new DiscordCommandOptions(["live"])
  .setRolesPermission(rolesPermissions)
  .setReplyToUser(false);

class LiveCommand extends ADiscordCommand {
  constructor(enabled: boolean = true) {
    super(options, enabled);
  }

  public async execute(
    message: DiscordMessage,
    user: User,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    //TODO method getCurrentStream in TwitchClient
    const broadcaster = MainApp.getTwitchClient().getBroadcaster();
    const stream = await MainApp.getTwitchClient().getCurrentStream();
    MainApp.getDiscordClient().sendLiveAnounce(stream, broadcaster);
  }
}

export const liveCommand = new LiveCommand();
