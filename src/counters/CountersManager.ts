import Counter from "./Counter";
import { allCounters } from "./AllCounters";

export default class CountersManager {
  public static counters: Counter[] = allCounters;

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
