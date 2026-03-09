import ICommand from "../../ICommand";
import BanBestViewersBotCommand from "./BanBestViewersBotCommand";

export const banBestViewersBotCommand: BanBestViewersBotCommand =
  new BanBestViewersBotCommand();

// Arrays
export const allNoPrefixSimpleCommands: Array<ICommand> = [
  banBestViewersBotCommand,
];
