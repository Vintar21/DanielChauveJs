import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../../app";
import { Permissions } from "../../utils/permissions/Permissions";
import { getVipOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import ACommand from "../templates/ACommand";
import CommandOptions from "../options/CommandOptions";

const mainTrigger: string = "marker";

const rolesPermissions: Permissions<Role> = getVipOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  "markers",
  "marqueur",
  "marqueurs",
]).setRolesPermission(rolesPermissions);

export default class AnswerRandomMessage extends ACommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    // Check if stream is online first
    // TODO add title
    const twitchClient = MainApp.getTwitchClient();
    twitchClient.createMarker();
    this.replyOrSend(user, event, ignoreCooldowns, "Marker créé chef !");
  }
}
