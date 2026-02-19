import Counter from "../../counters/Counter";
import { Placeholders } from "../../commands/CommandsUtils";
import CounterCommandOptions from "../CounterCommanOptions";
import ACounterCommand from "../templates/ACounterCommand";

const options: CounterCommandOptions = new CounterCommandOptions([
  /morts?/i,
  /deaths?/i,
]).canInitIfNoCounterForCategory();

export default class DeathCounterCommand extends ACounterCommand {
  protected getCounterMessage: string = `${Placeholders.BROADCASTER} est mort ${Placeholders.COUNTER} fois dans ${Placeholders.CATEGORY}`;
  protected modifyCounterMessage: string = this.getCounterMessage;

  constructor(counter: Counter, enabled: boolean = true) {
    super(counter, options, enabled);
  }
}
