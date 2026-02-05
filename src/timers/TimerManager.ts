import ATimer from "./ATimer";
import MainTimer from "./MainTimer";

export default class TimerManager {
  private timers: Array<ATimer> = [];

  private static instance: TimerManager = new TimerManager();

  private constructor() {}

  public static getInstanceAndInit(): TimerManager {
    const instance = TimerManager.instance;
    if (instance.timers.length === 0) {
      instance.init();
    }
    return instance;
  }

  // Use getInstanceAndInit instead
  public init(): void {
    const mainTimer = new MainTimer();
    this.timers.push(mainTimer);
  }

  public startAllTimers(): void {
    this.timers.forEach((timer) => timer.start());
  }

  public updateAllTimersOnMessage(): void {
    this.timers.forEach((timer) => timer.updateOnMessageReceived());
  }
}
