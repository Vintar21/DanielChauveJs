import Counter from "../../counters/Counter";
import { Placeholders } from "../../utils/CommandsUtils";
import { seconds } from "../../utils/CommonUtils";
import { getVipOnlyRolesPermissions } from "../../utils/RoleUtils";
import CounterCommandOptions from "../options/CounterCommanOptions";
import ACounterCommand from "../templates/ACounterCommand";

// Example of another counter commands
const rolesModificationPermissions = getVipOnlyRolesPermissions();

const options: CounterCommandOptions = new CounterCommandOptions([])
  .setCounterModificationPermissions(rolesModificationPermissions)
  .setGlobalCooldown(seconds(20)) as CounterCommandOptions;

export default class GenericCounterCommand extends ACounterCommand {
  protected defaultGetCounterMessage: string = `On en est à ${Placeholders.COUNTER} !`;
  protected defaultModifyCounterMessage: string = this.defaultGetCounterMessage;

  constructor(counter: Counter, enabled: boolean = true) {
    super(counter.getName(), counter, options, enabled);
  }
}
