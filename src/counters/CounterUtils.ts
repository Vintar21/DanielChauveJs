export type CounterBehavior = symbol | ((c: number) => number);

export const CounterBehaviors = Object.freeze({
  INCREMENT: Symbol("increment"),
  DECREMENT: Symbol("decrement"),
});

export type CounterStorage = symbol;
export const CounterStorages = Object.freeze({
  GSHEET: Symbol("gsheet"),
  DATABASE: Symbol("database"),
});
