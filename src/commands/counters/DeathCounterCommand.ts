import Counter from "../../counters/Counter";
import { Placeholders } from "../../utils/CommandsUtils";
import { EMPTY } from "../../utils/StringConstants";
import CounterCommandOptions from "../options/CounterCommanOptions";
import ACounterCommand from "../templates/ACounterCommand";

const options: CounterCommandOptions = new CounterCommandOptions([
  /morts?/i,
  /deaths?/i,
]).canInitIfNoCounterForCategory();

export default class DeathCounterCommand extends ACounterCommand {
  protected getCounterMessage: string = `${Placeholders.RANDOM_PART_1} ${Placeholders.BROADCASTER} est mort de manière ${Placeholders.RANDOM_PART_2} ${Placeholders.COUNTER} fois dans ${Placeholders.CATEGORY}`;
  protected modifyCounterMessage: string = this.getCounterMessage;

  constructor(counter: Counter, enabled: boolean = true) {
    super(counter, options, enabled);
    this.randomParts.set(Placeholders.RANDOM_PART_1, [
      EMPTY,
      "Coup dur...",
      "Aïe aïe aïe,",
    ]);
    this.randomParts.set(Placeholders.RANDOM_PART_2, [
      "ridicule",
      "nulle",
      "naze",
      "rocambolesque",
      "idiote",
      "héroïque",
      "marrante",
      "inutile",
    ]);
  }
}
