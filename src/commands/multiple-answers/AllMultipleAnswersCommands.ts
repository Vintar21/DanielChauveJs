import ICommand from "../ICommand";
import SmashOrPassCommand from "./SmashOrPassCommand";
import ItsATenButCommand from "./ItsATenButCommand";

export const smashOrPassCommand: SmashOrPassCommand = new SmashOrPassCommand();
export const itsATenButCommand: ItsATenButCommand = new ItsATenButCommand();

export const allMultipleAnswersCommands: Array<ICommand> = [
  smashOrPassCommand,
  itsATenButCommand,
];
