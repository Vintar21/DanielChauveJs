import ICommand from "../ICommand";
import MultiCommand from "./MultiCommand";
import RollCommand from "./RollCommand";
import AnswerRandomMessage from "./AnswerRandomMessage";

// Commands
export const rollCommand: RollCommand = new RollCommand();
export const multiCommand: MultiCommand = new MultiCommand();
// In a separate array because it should be added in last !
export const answerRandomMessage: AnswerRandomMessage =
  new AnswerRandomMessage();

// Arrays
export const allMiscCommands: Array<ICommand> = [rollCommand, multiCommand];
export const lastAddedCommands: Array<ICommand> = [answerRandomMessage];
