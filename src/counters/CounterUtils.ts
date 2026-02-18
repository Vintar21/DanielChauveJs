export type CounterBehavior = symbol | ((c: number) => number);

export const CounterBehaviors = Object.freeze({
  INCREMENT: Symbol("increment"),
  DECREMENT: Symbol("decrement"),
});

export const COUNTER_VALUE = "$COUNTER";
