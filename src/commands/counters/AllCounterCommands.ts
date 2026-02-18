import DeathCounterCommand from "../counters/DeathCounterCommand";
import { deathCounterZeldaTP } from "../../counters/CountersManager";
import ACounterCommand from "../templates/ACounterCommand";

export const deathCounterZeldaTpCommand: DeathCounterCommand =
  new DeathCounterCommand(deathCounterZeldaTP);

export const allCounterCommands: ACounterCommand[] = [
  deathCounterZeldaTpCommand,
];
