import { MainApp } from "../../app";
import TwitchClient from "../../twitch/TwitchClient";
import { getModOnlyRolesPermissions } from "../../utils/RoleUtils";
import { EMPTY, SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import { DiscordMessage, TWITCH_ARGUMENT } from "../DiscordConstants";
import ADiscordCommand from "./ADiscordCommand";
import DiscordCommandOptions from "./options/DiscordCommandOptions";

const permissions = getModOnlyRolesPermissions();

const options = new DiscordCommandOptions(["say"])
  .setRolesPermission(permissions)
  .setReplyToUser(false);

class SayCommand extends ADiscordCommand {
  constructor(enabled: boolean = true) {
    super(options, enabled);
  }

  public execute(
    message: DiscordMessage,
    user: User,
    ignoreCooldowns: boolean = false,
  ): void {
    const args = this.getArgs(message);
    if (args.length > 1) {
      const channelId = args[0].toLowerCase().replaceAll(/[<>#]/g, EMPTY);
      const message = args.slice(1).join(SPACE);
      if (channelId === TWITCH_ARGUMENT) {
        TwitchClient.send(message);
        this.updateCooldowns(user.userId);
      } else {
        const channel = MainApp.getDiscordClient().getChannel(channelId);
        if (channel && channel?.isSendable()) {
          channel.send(message);
          this.updateCooldowns(user.userId);
        }
      }
    }
  }
}

export const sayCommand = new SayCommand();
