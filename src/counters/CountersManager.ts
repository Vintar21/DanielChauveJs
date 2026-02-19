import Counter from "./Counter";
import CounterBuilder from "./CounterBuilder";
import { Placeholders } from "../commands/CommandsUtils";

export const deathCounter: Counter = CounterBuilder.getInstance()
  .name("mort")
  .categoryRelated()
  .storedInDatabase()
  .obsSourceName("deathCount")
  .obsTextSourceTemplate(`Morts: ${Placeholders.COUNTER}`)
  .build();

export default class CountersManager {
  public static counters: Counter[] = [deathCounter];

  public static async initAllCounters(): Promise<void> {
    Promise.all(CountersManager.counters.map((counter) => counter.init()));
  }

  public static addCounter(counter: Counter): void {
    CountersManager.counters.push(counter);
  }

  public static addCounters(counters: Counter[]): void {
    counters.forEach((counter) => CountersManager.addCounter(counter));
  }
}
