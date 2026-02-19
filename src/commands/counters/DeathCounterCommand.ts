import { CATEGORY_VALUE, COUNTER_VALUE } from "../../counters/CounterUtils";
import CounterCommandOptions from "../CounterCommanOptions";
import ACounterCommand from "../templates/ACounterCommand";
import Counter from "../../counters/Counter";

const options: CounterCommandOptions = new CounterCommandOptions([
  /morts?/i,
  /deaths?/i,
]).canInitIfNoCounterForCategory();

export default class DeathCounterCommand extends ACounterCommand {
  protected getCounterMessage: string = `Vintar est mort ${COUNTER_VALUE} fois dans ${CATEGORY_VALUE}`;
  protected modifyCounterMessage: string = this.getCounterMessage;

  constructor(counter: Counter, enabled: boolean = true) {
    super(counter, options);
  }
}
