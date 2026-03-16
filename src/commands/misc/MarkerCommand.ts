import { ChatMessage } from "@twurple/chat";
import { MainApp } from "../../app";
import { Permissions } from "../../utils/permissions/Permissions";
import { getVipOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import ACommand from "../templates/ACommand";

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
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ): void {
    // Check if stream is online first
    // TODO add title
    const twitchClient = MainApp.getTwitchClient();
    twitchClient.createMarker();
    this.replyOrSend(user, chatMessage, ignoreCooldowns, "Marker créé chef !");
  }
}
