import { MessageEvent } from "@twurple/easy-bot";
import { allCounters } from "../../counters/AllCounters";
import CounterBuilder from "../../counters/CounterBuilder";
import CountersManager from "../../counters/CountersManager";
import { CounterStorages } from "../../counters/CounterUtils";
import ATwitchClient from "../../twitch/ATwitchClient";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import GenericCounterCommand from "../counters/GenericCountCommand";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";
import MultipleAnswersCommand from "../templates/MultipleAnswersCommand";
import GoogleSheetManager from "../../google/GoogleSheetManager";
import { MainApp } from "../../app";
import { SPACE } from "../../utils/StringConstants";

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
      const formatedCounterName = commandName.toLowerCase();
      const existingCommand =
        ATwitchClient.commandsManager.commandsMap.get(formatedCounterName);

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
      ATwitchClient.commandsManager.addCommand(command);
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
