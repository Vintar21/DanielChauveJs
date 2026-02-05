import { send } from "../app";
import { EMPTY } from "../utils/StringConstants";
import TimerOptions from "./TimerOptions";

export default abstract class ATimer {
  protected options: TimerOptions;
  protected timerFinished: boolean = false;
  // Number of messages posted since last trigger
  protected numberOfMessagePosted: number = 0;

  protected messages: String[];

  constructor(options: TimerOptions, messages: String[]) {
    this.options = options;
    this.messages = messages.reverse();
  }

  public start(): void {
    setTimeout(() => this.timeoutReached(), this.options.getMinTimeElapsed());
  }

  public restart(): void {
    this.numberOfMessagePosted = 0;
    this.timerFinished = false;
    this.start();
  }

  protected timeoutReached(): void {
    this.timerFinished = true;
    this.check();
  }

  public updateOnMessageReceived(): void {
    this.numberOfMessagePosted += 1;
    this.check();
  }

  private canBeTriggered(): boolean {
    return (
      this.timerFinished &&
      this.numberOfMessagePosted >= this.options.getMinNumberOfMessage()
    );
  }

  // Check if a message is received or if the timer is finished
  public check() {
    if (this.canBeTriggered()) {
      const messageToSend: String = this.messages.pop() ?? EMPTY;
      send(messageToSend);
      this.messages = [messageToSend].concat(this.messages);
      this.restart();
    }
  }
}
