import { deathCounter } from "../../counters/CountersManager";
import DeathCounterCommand from "../counters/DeathCounterCommand";
import ACounterCommand from "../templates/ACounterCommand";

export const deathCounterZeldaTpCommand: DeathCounterCommand =
  new DeathCounterCommand(deathCounter, true);

export const allCounterCommands: ACounterCommand[] = [
  deathCounterZeldaTpCommand,
];
