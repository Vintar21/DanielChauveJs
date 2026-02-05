import RollCommand from "./RollCommand";
import ICommand from "../ICommand";

// Commands
export const rollCommand: RollCommand = new RollCommand();

// Arrays
export const allMiscCommands: Array<ICommand> = [rollCommand];
