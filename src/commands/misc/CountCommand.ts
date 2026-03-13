import { MessageEvent } from "@twurple/easy-bot";
import { allCounters } from "../../counters/AllCounters";
import CounterBuilder from "../../counters/CounterBuilder";
import ATwitchClient from "../../twitch/ATwitchClient";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import GenericCounterCommand from "../counters/GenericCountCommand";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";
import CountersManager from "../../counters/CountersManager";
import { storage } from "googleapis/build/src/apis/storage";
import { CounterStorages } from "../../counters/CounterUtils";

const mainTrigger: string = "count";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  "counter",
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
    if (args.length === 0) {
      this.replyOrSend(
        user,
        event,
        ignoreCooldowns,
        "Faut que tu me donne au moins le nom du compteur à créé chef",
      );
      return;
    } else if (args.length >= 1) {
      const counterName = args[0].trim().normalize();

      // TODO: map of counters
      const existingCounter = allCounters.find(
        (counter) =>
          counter.getName().toLowerCase() === counterName.toLowerCase(),
      );

      if (existingCounter) {
        this.replyOrSend(
          user,
          event,
          ignoreCooldowns,
          `Y a déjà un compteur qui s'appelle ${existingCounter.getName()}, faut trouver autre chose désolé :/`,
        );
        return;
      }

      const builder = CounterBuilder.getInstance()
        .name(counterName)
        .setStorage(CounterStorages.GSHEET);

      if (args.length >= 2 && !isNaN(Number(args[1]))) {
        builder.start(Number(args[1]));
      }

      // Creating the counter
      const counter = builder.build();
      CountersManager.addCounter(counter);

      // Creating the command
      const command = new GenericCounterCommand(counter);
      // TODO: Save the command and the counter
      ATwitchClient.commandsManager.addCommand(command);

      this.replyOrSend(
        user,
        event,
        ignoreCooldowns,
        `Le compteur !${counterName} a été créé, il commence à ${counter.getStartValue()} !`,
      );
    }
  }
}
