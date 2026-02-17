import ICommand from "../ICommand";
import AnswerRandomMessage from "./AnswerRandomMessage";
import MultiCommand from "./MultiCommand";
import RollCommand from "./RollCommand";
import ResetMvpCommand from "./ResetMvpCommand";
import MarkerCommand from "./MarkerCommand";
import PredictionCommand from "./PredictionCommand";

// Commands
export const rollCommand: RollCommand = new RollCommand();
export const multiCommand: MultiCommand = new MultiCommand();
export const resetMvpCommand: ResetMvpCommand = new ResetMvpCommand();
export const markerCommand: MarkerCommand = new MarkerCommand();
export const predictionCommand: PredictionCommand = new PredictionCommand();

// In a separate array because it should be added in last !
export const answerRandomMessage: AnswerRandomMessage =
  new AnswerRandomMessage();

// Arrays
export const allMiscCommands: Array<ICommand> = [
  rollCommand,
  markerCommand,
  multiCommand,
  predictionCommand,
  resetMvpCommand,
];
export const lastAddedCommands: Array<ICommand> = [answerRandomMessage];
