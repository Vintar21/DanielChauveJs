import { MessageEvent } from "@twurple/easy-bot";
import { channel } from "../../config/ConfigLoader";
import { User } from "../../utils/user/User";
import { Permissions } from "../../utils/permissions/Permissions";
import { getVipOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { SLASH, SPACE } from "../../utils/StringConstants";
import ACommand from "../templates/ACommand";
import CommandOptions from "../options/CommandOptions";

const mainTrigger: string = "multi";

const rolesPermissions: Permissions<Role> = getVipOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([]).setRolesPermission(
  rolesPermissions,
);

// TODO: extends AArgumentsCommand
export default class MultiCommand extends ACommand {
  // The broadcaster channel is always in the link
  private channels: string[] = [channel];
  private static linkPrefix: string = "https://kadgar.net/live/";
  private static messageStart: string = "Pour suivre toutes les POVs: ";

  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    const messageParts: string[] = event.text.trim().split(SPACE);
    // [!multi, firstchannel, ...]
    if (messageParts.length > 1) {
      this.channels.concat(messageParts.slice(1));
    }
    const message =
      MultiCommand.messageStart +
      MultiCommand.linkPrefix +
      this.channels.join(SLASH);
    // TODO: Pin the message
    this.replyOrSend(user, event, ignoreCooldowns, message);
  }
}
