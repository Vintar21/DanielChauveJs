import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../../app";
import { Placeholders } from "../../utils/CommandsUtils";
import Counter from "../../counters/Counter";
import { minutes } from "../../utils/CommonUtils";
import { getDefaultRolesPermissions, Roles } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import CounterCommandOptions from "../options/CounterCommanOptions";
import ACounterCommand from "../templates/ACounterCommand";
import {
  BLUE_PRINCE,
  getCategoryPermissions,
} from "../../utils/CategoriesConstants";

// TODO: FollowerOnlyPermissions
// Example of another counter commands
const rolesModificationPermissions = getDefaultRolesPermissions();
rolesModificationPermissions.unallow(Roles.NO_ROLE);

const categoriesPermissions = getCategoryPermissions(BLUE_PRINCE);

const options: CounterCommandOptions = new CounterCommandOptions([
  /jours?/i,
  /days?/i,
  /blue-?prince?/i,
  /deaths?/i,
])
  .setCounterModificationPermissions(rolesModificationPermissions)
  .setCategoriesPermissions(categoriesPermissions)
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
    this.updateTitle();
  }

  protected setArg(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
    value: number,
  ): void {
    super.setArg(user, event, ignoreCooldowns, value);
    this.addMarker();
    this.updateTitle();
  }

  private addMarker(): void {
    const twitchClient = MainApp.getTwitchClient();
    twitchClient
      .getBroadcaster()
      .getStream()
      .then((stream) => {
        if (stream && stream !== null) {
          twitchClient.createMarker(`Jour ${this.counter.getValue()}`);
        }
      });
  }

  public updateTitle(): void {
    const twitchClient = MainApp.getTwitchClient();
    twitchClient
      .getTitle()
      .then((title) =>
        twitchClient.setTitle(
          title.replaceAll(/\bJour \d+/gi, `Jour ${this.counter.getValue()}`),
        ),
      );
  }
}
