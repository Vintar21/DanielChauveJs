import { MessageEvent } from "@twurple/easy-bot";
import { broadcasterApp, MainApp } from "../../app";
import Counter from "../../counters/Counter";
import CounterBuilder from "../../counters/CounterBuilder";
import {
  Placeholders,
  formatCounterMessage,
} from "../../commands/CommandsUtils";
import SqlManager from "../../database/SqlManager";
import User from "../../utils/user/User";
import { getGreaterRole } from "../../utils/RoleUtils";
import { MINUS, PLUS } from "../../utils/StringConstants";
import CounterCommandOptions from "../CounterCommanOptions";
import AArgumentsCommand from "./AArgumentsCommand";

const RESET_COUNTER_ARG = "reset";
const FREEZE_COUNTER_ARG = "freeze";
const UNFREEZE_COUNTER_ARG = "unfreeze";

export default abstract class ACounterCommand extends AArgumentsCommand {
  // undefined by default otherwise VSCode is mad
  protected options: CounterCommandOptions = undefined;
  protected counter: Counter;

  protected countersMap: Map<string, Counter> = new Map();

  protected abstract getCounterMessage: string;
  protected abstract modifyCounterMessage: string;
  protected resetCounterMessage: string = `Le compteur a été reset à la valeur ${Placeholders.COUNTER}`;
  protected reachStopMessage: string = `Le compteur a atteint sa limite de ${Placeholders.COUNTER} :stop_sign:`;
  protected freezeMessage: string = `Le compteur a été freeze à la valeur ${Placeholders.COUNTER} :ice_cube:`;
  protected unfreezeMessage: string = `Le compteur n'est plus freeze, il vaut toujours ${Placeholders.COUNTER}`;

  constructor(
    counter: Counter,
    options: CounterCommandOptions,
    enabled: boolean = true,
  ) {
    super(options, enabled);
    this.counter = counter;
    this.options = options;
  }

  public async initCountersMapIfEmpty(): Promise<void> {
    if (this.countersMap.size === 0) {
      this.countersMap.set(this.counter.getCategory(), this.counter);
      await SqlManager.getAllCounterValues(this.counter.getName()).then(
        (categoriesValuesMap) => {
          if (categoriesValuesMap) {
            categoriesValuesMap.forEach((value: number, key: string) => {
              if (this.countersMap.has(key)) {
                this.countersMap.get(key).setValue(value);
              } else {
                const newCounter = CounterBuilder.getInstance()
                  .from(this.counter)
                  .category(key)
                  .build();
                newCounter.setValue(value);
                this.countersMap.set(key, newCounter);
              }
            });
          }
        },
      );
    }
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
    return !this.options.counterModificationPermissions.isUnallowed(role);
  }

  public async match(input: string, formatMessage?: boolean): Promise<boolean> {
    if (this.counter.isCategoryRelated()) {
      await this.initCountersMapIfEmpty();
      return MainApp.getCurrentGame().then((game) => {
        if (game === this.counter.getCategory()) {
          return super.match(input, formatMessage);
        } else if (this.countersMap.has(game)) {
          this.counter = this.countersMap.get(game);
          return super.match(input, formatMessage);
        } else if (game && this.options.initIfNoCounterForCategory) {
          this.counter = CounterBuilder.getInstance()
            .from(this.counter)
            .category(game)
            .build();
          this.countersMap.set(game, this.counter);
          return super.match(input, formatMessage);
        }
        return false;
      });
    }
    return super.match(input, formatMessage);
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
      formatCounterMessage(message, this.counter),
    );
  }
}
