import ICommand from "../ICommand";
import MultiCommand from "./MultiCommand";
import RollCommand from "./RollCommand";

// Commands
export const rollCommand: RollCommand = new RollCommand();
export const multiCommand: MultiCommand = new MultiCommand();

// Arrays
export const allMiscCommands: Array<ICommand> = [rollCommand, multiCommand];
