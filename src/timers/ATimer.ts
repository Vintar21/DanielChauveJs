import ACommand from "../commands/templates/ACommand";
import ATwitchClient from "../twitch/ATwitchClient";
import TwitchClient from "../twitch/TwitchClient";
import { NO_MSG } from "../utils/CommandsUtils";
import { EMPTY } from "../utils/StringConstants";
import { timerUser } from "../utils/user/User";
import { TimerMessage } from "./TimerMessage";
import TimerOptions from "./TimerOptions";

export default abstract class ATimer {
  protected options: TimerOptions;
  protected timerFinished: boolean = false;
  // Number of messages posted since last trigger
  protected numberOfMessagePosted: number = 0;

  protected messages: TimerMessage[];

  constructor(options: TimerOptions, messages: TimerMessage[]) {
    this.options = options;
    this.messages = messages.reverse();
  }

  public start(): void {
    this.messages = this.messages.map((message) => {
      if (message instanceof String) {
        return (
          ATwitchClient.commandsManager.commandsMap.get(message.toString()) ??
          message
        );
      }
      return message;
    });
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
      const messageToSend: TimerMessage = this.messages.pop() ?? EMPTY;

      if (messageToSend instanceof ACommand) {
        messageToSend.execute(timerUser, NO_MSG, true);
      } else if (messageToSend !== EMPTY) {
        TwitchClient.send(messageToSend.toString());
      }

      this.messages = [messageToSend].concat(this.messages);
      this.restart();
    }
  }
}
