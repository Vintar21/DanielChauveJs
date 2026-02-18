import Counter from "./Counter";
import CounterBuilder from "./CounterBuilder";
import { COUNTER_VALUE } from "./CounterUtils";

export const deathCounterZeldaTP: Counter = CounterBuilder.getInstance()
  .name("mort")
  .category("The Legend of Zelda: Twilight Princess")
  .storedInDatabase()
  .obsSourceName("deathCount")
  .obsTextSourceTemplate(`Morts: ${COUNTER_VALUE}`)
  .build();

export default class CountersManager {
  public static counters: Counter[] = [deathCounterZeldaTP];

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
