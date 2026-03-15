import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../../app";
import { COMMAND_PREFIX } from "../../utils/CommandsUtils";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";
import MultipleAnswersCommand from "../templates/MultipleAnswersCommand";

const mainTrigger: string = "addCommand";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  "addCommande",
]).setRolesPermission(rolesPermissions);

export default class CountCommand extends AArgumentsCommand {
  constructor() {
    super(mainTrigger, options, true);
  }

  protected async executeWithArgs(
    user: User,
    event: MessageEvent,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void> {
    if (args.length <= 1) {
      this.replyOrSend(
        user,
        event,
        ignoreCooldowns,
        "Faut que tu me donne au moins le nom de la commande et un texte qui va avec bg",
      );
      return;
    } else {
      const commandName = args[0].trim().normalize();

      // TODO: map of counters
      const formatedCounterName = COMMAND_PREFIX + commandName.toLowerCase();
      const existingCommand = MainApp.getTwitchClient()
        .getCommandsManager()
        .commandsMap.get(formatedCounterName);

      if (existingCommand) {
        this.replyOrSend(
          user,
          event,
          ignoreCooldowns,
          `Y a déjà une commande qui s'appelle ${existingCommand.getName()}, faut trouver autre chose désolé :/`,
        );
        return;
      }

      const answer = args.slice(1).join(SPACE).toString();
      const options = new CommandOptions([]);

      // Creating the command
      const command = new MultipleAnswersCommand(commandName, options, [
        answer,
      ]);

      // TODO: Save the command and the counter
      MainApp.getTwitchClient().getCommandsManager().addCommand(command);
      MainApp.getGoogleSheetManager().addCommand(command);

      this.replyOrSend(
        user,
        event,
        ignoreCooldowns,
        `La commande !${commandName} a été créée !`,
      );
    }
  }
}
