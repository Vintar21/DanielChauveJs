import Counter from "../../counters/Counter";
import { Placeholders } from "../../commands/CommandsUtils";
import CounterCommandOptions from "../CounterCommanOptions";
import ACounterCommand from "../templates/ACounterCommand";
import { minutes } from "../../utils/CommonUtils";
import { getDefaultRolesPermissions } from "../../utils/RoleUtils";
import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../../utils/user/User";
import { MainApp } from "../../app";

const rolesModificationPermissions = getDefaultRolesPermissions();

const options: CounterCommandOptions = new CounterCommandOptions([
  /jours?/i,
  /days?/i,
  /blue-?prince?/i,
  /deaths?/i,
])
  .setCounterModificationPermissions(rolesModificationPermissions)
  .setGlobalCooldown(minutes(2)) as CounterCommandOptions;

export default class BluePrinceDayCounterCommand extends ACounterCommand {
  protected getCounterMessage: string = `On est au jour ${Placeholders.COUNTER} dans ${Placeholders.CATEGORY}, je considère être très avancé alors attention aux spoils vintarLoveC`;
  protected modifyCounterMessage: string = `Encore une bonne journée qui se termine dans ${Placeholders.CATEGORY} ! Direction le jour ${Placeholders.COUNTER} !`;

  constructor(counter: Counter, enabled: boolean = true) {
    super(counter, options, enabled);
  }

  protected plusArg(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
    step?: number,
  ): void {
    super.plusArg(user, event, ignoreCooldowns, step);
    this.addMarker();
  }

  protected setArg(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
    value: number,
  ): void {
    super.setArg(user, event, ignoreCooldowns, value);
    this.addMarker();
  }

  private addMarker(): void {
    MainApp.getBroadcaster()
      .getStream()
      .then((stream) => {
        if (stream && stream !== null) {
          MainApp.botApp.api.streams.createStreamMarker(
            MainApp.getBroadcasterId(),
            `Jour ${this.counter.getValue()}`,
          );
        }
      });
  }
}
