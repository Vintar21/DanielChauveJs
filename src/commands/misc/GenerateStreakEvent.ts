import { MainApp } from "../../app";
import WatchStreakEvent from "../../twitch/events/WatchStreakEvent";
import { COMMAND_PREFIX } from "../../utils/CommandsUtils";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";
import ACommand from "../templates/ACommand";
import MultipleAnswersCommand from "../templates/MultipleAnswersCommand";
import { ChatMessage } from "@twurple/chat";

const mainTrigger: string = "streak";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([]).setRolesPermission(
  rolesPermissions,
);

export default class GenerateStreakCommand extends ACommand {
  constructor() {
    super(mainTrigger, options, true);
  }

  public async execute(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ): Promise<void> {
    if (user.userId) {
      MainApp.getTwitchClient().eventEmitter.emit(
        WatchStreakEvent.TYPE,
        new WatchStreakEvent(user.userId, 42),
      );
    }
  }
}
