import { minutes, seconds } from "../utils/CommonUtils";

export default class TimerOptions {
  private minNumberOfMessages: number = 25;
  private minTimeElapsed: number = minutes(10);

  constructor() {}

  public setMinNumberOfMessage(min: number): TimerOptions {
    this.minNumberOfMessages = min;
    return this;
  }

  public getMinNumberOfMessage(): number {
    return this.minNumberOfMessages;
  }

  public setTimerInSeconds(sec: number): TimerOptions {
    this.minTimeElapsed = seconds(sec);
    return this;
  }

  public setTimerInMinutes(min: number): TimerOptions {
    this.minTimeElapsed = minutes(min);
    return this;
  }

  public getMinTimeElapsed(): number {
    return this.minTimeElapsed;
  }
}
