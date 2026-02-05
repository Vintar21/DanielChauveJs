import ICommand from "../ICommand";
import DanielCommand from "./DanielCommand";
import HelloCommand from "./HelloCommand";
import ShittyGameCommand from "./ShittyGameCommand";
import SwitchFriendCodeCommand from "./SwitchFriendCodeCommand";
import { allJdrCommands } from "./jdr/AllJdrCommands";

export const danielCommand = new DanielCommand();
export const helloCommand = new HelloCommand();
export const shittyGameCommand = new ShittyGameCommand();
export const switchFriendCodeCommand = new SwitchFriendCodeCommand();

// Arrays
export const allSimpleCommands: Array<ICommand> = [
  ...allJdrCommands,
  danielCommand,
  helloCommand,
  shittyGameCommand,
  switchFriendCodeCommand,
];
