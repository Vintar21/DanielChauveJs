import { discordServerIdBg3 } from "../../config/ConfigLoader";
import { getDefaultRolesPermissions } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import { DiscordMessage } from "../DiscordConstants";
import ADiscordCommand from "./ADiscordCommand";
import DiscordCommandOptions from "./options/DiscordCommandOptions";

const permissions = getDefaultRolesPermissions();

const options = new DiscordCommandOptions(["roll", "r"])
  .setRolesPermission(permissions)
  .setReplyToUser(true)
  .dontUsePrefix();

class RollBg3ServCommand extends ADiscordCommand {
  constructor(enabled: boolean = true) {
    super(options, enabled);
  }

  public async canExecute(
    user: User,
    message: DiscordMessage,
  ): Promise<boolean> {
    console.log(user);
    return (
      message.guildId === discordServerIdBg3 && super.canExecute(user, message)
    );
  }

  public async execute(
    message: DiscordMessage,
    user: User,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    const args = this.getArgs(message);
    const dice =
      args.length > 0 && !isNaN(Number(args[0])) ? Number(args[0]) : 100;

    const roll = Math.floor(Math.random() * (isNaN(dice) ? 100 : dice - 1)) + 1;
    const author = message.author.displayName;
    this.replyOrSend(
      message,
      `${author} lance son dé et fait un magnifique ${roll} !`,
      user,
      ignoreCooldowns,
    );
  }
}

export const rollBg3ServCommand = new RollBg3ServCommand();
