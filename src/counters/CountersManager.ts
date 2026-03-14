import Counter from "./Counter";
import { allCounters } from "./AllCounters";

export default class CountersManager {
  public static counters: Map<string, Counter> = new Map();

  public static async initAllCounters(): Promise<void> {
    allCounters.forEach((counter) => {
      counter.init();
      this.counters.set(counter.getName(), counter);
    });
  }

  public static addCounter(counter: Counter): void {
    CountersManager.counters.set(counter.getName(), counter);
  }

  public static addCounters(counters: Counter[]): void {
    counters.forEach((counter) => CountersManager.addCounter(counter));
  }
}
