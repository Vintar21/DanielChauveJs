import ICommand from "../../ICommand";
import OuaisOuaisOuaisCommand from "./OuaisOuaisOuaisCommand";
import BanBestViewersBotCommand from "./BanBestViewersBotCommand";

export const ouaisOuaisOuaisCommand: OuaisOuaisOuaisCommand =
  new OuaisOuaisOuaisCommand();
export const banBestViewersBotCommand: BanBestViewersBotCommand =
  new BanBestViewersBotCommand();

// Arrays
export const allNoPrefixSimpleCommands: Array<ICommand> = [
  ouaisOuaisOuaisCommand,
  banBestViewersBotCommand,
];
