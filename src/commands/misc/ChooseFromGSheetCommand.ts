import { MessageEvent } from "@twurple/easy-bot";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import ACommand from "../ACommand";
import CommandOptions from "../CommandOptions";
import { MainApp } from "../../app";
import { EMPTY } from "../../utils/StringConstants";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  /fruits?/i,
]).setRolesPermission(rolesPermissions);

// A simple example to send a random message/info from a list in a GSheet
export default class ChooseFromGSheetCommand extends ACommand {
  constructor(enabled: boolean = true) {
    super(options, enabled);
  }

  public async execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): Promise<void> {
    const fruit = await MainApp.getGoogleSheetManager().getRandomWord(
      "Fruits",
      "A2:A",
    );
    if (fruit !== EMPTY) {
      this.replyOrSend(
        user,
        event,
        ignoreCooldowns,
        `Voici ton fruit: ${fruit}`,
      );
    }
  }
}
