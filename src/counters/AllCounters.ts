import CounterBuilder from "./CounterBuilder";
import Counter from "./Counter";

import { Placeholders } from "../utils/CommandsUtils";
import { CounterStorages } from "./CounterUtils";
import { BLUE_PRINCE } from "../utils/CategoriesConstants";

export const bluePrinceDayCounter: Counter = CounterBuilder.getInstance()
  .name("jour")
  .categoryRelated()
  .category(BLUE_PRINCE)
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
