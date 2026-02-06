import ICommand from "../ICommand";
import AnswerRandomMessage from "./AnswerRandomMessage";
import MultiCommand from "./MultiCommand";
import RollCommand from "./RollCommand";
import ResetMvpCommand from "./ResetMvpCommand";

// Commands
export const rollCommand: RollCommand = new RollCommand();
export const multiCommand: MultiCommand = new MultiCommand();
export const resetMvpCommand: ResetMvpCommand = new ResetMvpCommand();
// In a separate array because it should be added in last !
export const answerRandomMessage: AnswerRandomMessage =
  new AnswerRandomMessage();

// Arrays
export const allMiscCommands: Array<ICommand> = [
  rollCommand,
  multiCommand,
  resetMvpCommand,
];
export const lastAddedCommands: Array<ICommand> = [answerRandomMessage];
