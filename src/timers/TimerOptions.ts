export default class TimerOptions {
  private minNumberOfMessages: number = 25;
  private minTimeElapsed: number = 10 * 60 * 1000; // milliseconds

  constructor() {}

  public setMinNumberOfMessage(min: number): TimerOptions {
    this.minNumberOfMessages = min;
    return this;
  }

  public getMinNumberOfMessage(): number {
    return this.minNumberOfMessages;
  }

  public setTimerInSeconds(sec: number): TimerOptions {
    this.minTimeElapsed = sec * 1000;
    return this;
  }

  public setTimerInMinutes(min: number): TimerOptions {
    this.setTimerInSeconds(min * 60);
    return this;
  }

  public getMinTimeElapsed(): number {
    return this.minTimeElapsed;
  }
}
