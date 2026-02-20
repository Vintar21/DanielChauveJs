import CounterBuilder from "./CounterBuilder";
import Counter from "./Counter";

import { Placeholders } from "../commands/CommandsUtils";

export const bluePrinceDayCounter: Counter = CounterBuilder.getInstance()
  .name("jour")
  .categoryRelated()
  .category("Blue Prince")
  .storedInDatabase()
  .obsSourceName("JourBluePrince")
  .obsTextSourceTemplate(`Jour ${Placeholders.COUNTER}`)
  .build();

export const deathCounter: Counter = CounterBuilder.getInstance()
  .name("mort")
  .categoryRelated()
  .storedInDatabase()
  .obsSourceName("deathCount")
  .obsTextSourceTemplate(`Morts: ${Placeholders.COUNTER}`)
  .build();

export const allCounters: Counter[] = [deathCounter, bluePrinceDayCounter];
