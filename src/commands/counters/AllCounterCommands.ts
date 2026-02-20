import { bluePrinceDayCounter, deathCounter } from "../../counters/AllCounters";
import DeathCounterCommand from "../counters/DeathCounterCommand";
import ACounterCommand from "../templates/ACounterCommand";
import BluePrinceDayCounterCommand from "./BluePrinceDayCounterCommand";

export const deathCounterCommand: DeathCounterCommand = new DeathCounterCommand(
  deathCounter,
  true,
);

export const bluePrinceDayCommand: BluePrinceDayCounterCommand =
  new BluePrinceDayCounterCommand(bluePrinceDayCounter);

export const allCounterCommands: ACounterCommand[] = [
  deathCounterCommand,
  bluePrinceDayCommand,
];
