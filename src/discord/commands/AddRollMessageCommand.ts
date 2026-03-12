import SqlManager from "../../database/SqlManager";
import { getModOnlyRolesPermissions } from "../../utils/RoleUtils";
import { SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import { DiscordMessage } from "../DiscordConstants";
import ADiscordCommand from "./ADiscordCommand";
import DiscordCommandOptions from "./options/DiscordCommandOptions";

const permissions = getModOnlyRolesPermissions();

const options = new DiscordCommandOptions([
  "addRollMessage",
  "addCustomMessage",
  "addCustomRollMessage",
])
  .setRolesPermission(permissions)
  .setReplyToUser(true);

class AddRollMessageCommand extends ADiscordCommand {
  constructor(enabled: boolean = true) {
    super(options, enabled);
  }

  public async execute(
    message: DiscordMessage,
    user: User,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    const args = this.getArgs(message);

    if (args.length >= 2) {
      const value = Number(args[0]);
      if (isNaN(value) || value < 1 || value > 1000) {
        this.replyOrSend(
          message,
          "Incorrect value specified, the first argument needs to be a number between 1 and 1000",
          user,
          ignoreCooldowns,
        );
        return;
      }
      const rollMessage = args.slice(1).join(SPACE);
      SqlManager.addRollsMessage(value, rollMessage);
      // TODO check with SqlManager return
      this.replyOrSend(message, "Message added", user, ignoreCooldowns);
    }
  }
}

export const addRollMessageCommand = new AddRollMessageCommand();
