import { MessageEvent } from "@twurple/easy-bot";
import User from "../../user/User";
import AArgumentsCommand from "./AArgumentsCommand";
import CounterCommandOptions from "../CounterCommanOptions";
import { broadcasterApp, MainApp } from "../../app";
import { getGreaterRole } from "../../utils/RoleUtils";
import { UNALLOWED } from "../../utils/CommonUtils";
import { MINUS, PLUS } from "../../utils/StringConstants";
import { COUNTER_VALUE } from "../../counters/CounterUtils";
import Counter from "../../counters/Counter";

const RESET_COUNTER_ARG = "reset";
const FREEZE_COUNTER_ARG = "freeze";
const UNFREEZE_COUNTER_ARG = "unfreeze";

export default abstract class ACounterCommand extends AArgumentsCommand {
  // undefined by default otherwise VSCode is mad
  protected options: CounterCommandOptions = undefined;
  protected counter: Counter;

  protected abstract getCounterMessage: string;
  protected abstract modifyCounterMessage: string;
  protected resetCounterMessage: string = `Le compteur a été reset à la valeur ${COUNTER_VALUE}`;
  protected reachStopMessage: string = `Le compteur a atteint sa limite de ${COUNTER_VALUE}`;
  protected freezeMessage: string = `Le compteur a été freeze à la valeur ${COUNTER_VALUE}`;
  protected unfreezeMessage: string = `Le compteur n'est plus freeze, il vaut toujours ${COUNTER_VALUE}`;

  constructor(
    counter: Counter,
    options: CounterCommandOptions,
    enabled: boolean = true,
  ) {
    super(options, enabled);
    this.counter = counter;
    // load the real value if it exists afterwards
    this.options = options;
  }

  protected executeWithArgs(
    user: User,
    event: MessageEvent,
    args: String[],
    ignoreCooldowns: boolean,
  ): void {
    this.canModifyCounter(event).then((canModifyCounter) => {
      if (args.length === 0) {
        // If the behavior is always triggers, do it otherwise, just send the message containing the current counter value
        if (this.options.shouldAlwaysTriggerBehavior && canModifyCounter) {
          this.counter.triggerCounter();
          this.replyOrSend(
            user,
            event,
            ignoreCooldowns,
            this.modifyCounterMessage,
          );
        } else {
          this.replyOrSend(
            user,
            event,
            ignoreCooldowns,
            this.getCounterMessage,
          );
        }
      }
      if (args.length === 1) {
        const arg = args[0];
        // Simple cases !counter +, !counter -, !counter reset
        switch (arg) {
          case PLUS:
            this.counter.addStep();
            this.replyOrSend(
              user,
              event,
              ignoreCooldowns,
              this.modifyCounterMessage,
            );
            return;
          case MINUS:
            this.counter.substractStep();
            this.replyOrSend(
              user,
              event,
              ignoreCooldowns,
              this.modifyCounterMessage,
            );
            return;
          case RESET_COUNTER_ARG:
            this.counter.resetValue();
            this.replyOrSend(
              user,
              event,
              ignoreCooldowns,
              this.resetCounterMessage,
            );
            return;
          case FREEZE_COUNTER_ARG:
            this.counter.freeze();
            this.replyOrSend(user, event, ignoreCooldowns, this.freezeMessage);
            return;
          case UNFREEZE_COUNTER_ARG:
            this.counter.freeze();
            this.replyOrSend(
              user,
              event,
              ignoreCooldowns,
              this.unfreezeMessage,
            );
            return;
        }

        // Custom step
        const customStep = Number(arg.substring(1));
        if (!isNaN(customStep)) {
          if (arg.startsWith(PLUS)) {
            this.counter.add(customStep);
            this.replyOrSend(
              user,
              event,
              ignoreCooldowns,
              this.modifyCounterMessage,
            );
            return;
          } else if (arg.startsWith(MINUS)) {
            this.counter.substract(customStep);
            this.replyOrSend(
              user,
              event,
              ignoreCooldowns,
              this.modifyCounterMessage,
            );
            return;
          }
        }

        // Set value directly
        const newValue = Number(arg);
        if (!isNaN(newValue)) {
          this.counter.setValue(newValue);
          this.replyOrSend(
            user,
            event,
            ignoreCooldowns,
            this.modifyCounterMessage,
          );
        }
      }
    });
  }

  private async canModifyCounter(event: MessageEvent): Promise<boolean> {
    const role = await getGreaterRole(event.getUser(), broadcasterApp);
    return (
      this.options.counterModificationPermissions.has(role) &&
      this.options.counterModificationPermissions.get(role) !== UNALLOWED
    );
  }

  public async match(input: string, formatMessage?: boolean): Promise<boolean> {
    return broadcasterApp.api.channels
      .getChannelInfoById(MainApp.getBroadcaster().id)
      .then((channel) => {
        if (channel?.gameName === this.counter.getCategory()) {
          return super.match(input, formatMessage);
        }
        return false;
      });
  }

  public replyOrSend(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
    message: String,
  ): void {
    super.replyOrSend(
      user,
      event,
      ignoreCooldowns,
      message.replaceAll(COUNTER_VALUE, this.counter.getValue().toString()),
    );
  }
}
