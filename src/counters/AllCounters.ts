import Counter from "./Counter";
import CounterBuilder from "./CounterBuilder";

import { Placeholders } from "../utils/CommandsUtils";
import { CounterStorages } from "./CounterUtils";

export const bluePrinceDayCounter: Counter = CounterBuilder.getInstance()
  .name("jour")
  .categoryRelated()
  .setStorage(CounterStorages.DATABASE)
  .obsSourceName("JourBluePrince")
  .obsTextSourceTemplate(`Jour ${Placeholders.COUNTER}`)
  .build();

export const deathCounter: Counter = CounterBuilder.getInstance()
  .name("mort")
  .categoryRelated()
  .setStorage(CounterStorages.DATABASE)
  .obsSourceName("deathCount")
  .obsTextSourceTemplate(`Morts: ${Placeholders.COUNTER}`)
  .build();

export const allCounters: Counter[] = [deathCounter, bluePrinceDayCounter];
