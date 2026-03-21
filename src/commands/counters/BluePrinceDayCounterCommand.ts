import { ChatMessage } from "@twurple/chat";
import { MainApp } from "../../app";
import Counter from "../../counters/Counter";
import {
  BLUE_PRINCE,
  getCategoryPermissions,
} from "../../utils/CategoriesConstants";
import { Placeholders } from "../../utils/CommandsUtils";
import { minutes } from "../../utils/CommonUtils";
import { getFollowerOnlyRolesPermissions } from "../../utils/RoleUtils";
import { User } from "../../utils/user/User";
import CounterCommandOptions from "../options/CounterCommanOptions";
import ACounterCommand from "../templates/ACounterCommand";

const mainTrigger = "jour";

// Example of another counter commands
// TODO: CHANGE THAT not only follower
const rolesModificationPermissions = getFollowerOnlyRolesPermissions();

const categoriesPermissions = getCategoryPermissions(BLUE_PRINCE);

const options: CounterCommandOptions = new CounterCommandOptions([
  "jours",
  "days",
  "day",
  "bluePrince",
  "blue-prince",
])
  .setCounterModificationPermissions(rolesModificationPermissions)
  .setCategoriesPermissions(categoriesPermissions)
  .setGlobalCooldown(minutes(2, true)) as CounterCommandOptions;

export default class BluePrinceDayCounterCommand extends ACounterCommand {
  protected defaultGetCounterMessage: string = `On est au jour ${Placeholders.COUNTER} dans ${Placeholders.CATEGORY}, je considère être très avancé alors attention aux spoils vintarLoveC`;
  protected defaultModifyCounterMessage: string = `Encore une bonne journée qui se termine dans ${Placeholders.CATEGORY} ! Direction le jour ${Placeholders.COUNTER} !`;

  constructor(counter: Counter, enabled: boolean = true) {
    super(mainTrigger, counter, options, enabled);
    this.addSpecialValueMessage(
      100,
      `OMG la centaine de jours sur le ${Placeholders.CATEGORY} et il a toujours pas tout fini ???`,
    );
  }

  protected plusArg(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
    step?: number,
  ): void {
    super.plusArg(user, chatMessage, ignoreCooldowns, step);
    this.addMarker();
    this.updateTitle();
  }

  protected setArg(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
    value: number,
  ): void {
    super.setArg(user, chatMessage, ignoreCooldowns, value);
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
