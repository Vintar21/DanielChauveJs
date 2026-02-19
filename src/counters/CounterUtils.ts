import { MainApp } from "../app";
import Counter from "./Counter";

export type CounterBehavior = symbol | ((c: number) => number);

export const CounterBehaviors = Object.freeze({
  INCREMENT: Symbol("increment"),
  DECREMENT: Symbol("decrement"),
});

// TODO rename thos variable, I don't like VALUE prefix
export const BROADCASTER_VALUE = "$BROADCASTER";
export const COUNTER_VALUE = "$COUNTER";
export const CATEGORY_VALUE = "$CATEGORY";

export function formatCounterMessage(
  message: String,
  counter: Counter,
): String {
  return message
    .replaceAll(COUNTER_VALUE, counter.getValue().toString())
    .replaceAll(CATEGORY_VALUE, counter.getCategory()?.toString())
    .replaceAll(BROADCASTER_VALUE, MainApp.getBroadcaster().name);
}
