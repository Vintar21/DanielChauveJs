import ICommand from "../../ICommand";
import CthulhuCommand from "./CthulhuCommand";
import GianniCommand from "./GianniCommand";
import GustaveCommand from "./GustaveCommand";
import MarlaCommand from "./MarlaCommand";
import MartaCommand from "./MartaCommand";
import MichelCommand from "./MichelCommand";
import PeterCommand from "./PeterCommand";
import SidoniaCommand from "./SidoniaCommand";
import SummaryCommand from "./SummaryCommand";
import ThelmaCommand from "./ThelmaCommand";

// PJ Commands
export const gianniCommand: GianniCommand = new GianniCommand();
export const gustaveCommand: GustaveCommand = new GustaveCommand();
export const marlaCommand: MarlaCommand = new MarlaCommand();
export const martaCommand: MartaCommand = new MartaCommand();
export const michelCommand: MichelCommand = new MichelCommand();
export const peterCommand: PeterCommand = new PeterCommand();
export const sidoniaCommand: SidoniaCommand = new SidoniaCommand();
export const thelmaCommand: ThelmaCommand = new ThelmaCommand();

// Misc
export const cthulhuCommand: CthulhuCommand = new CthulhuCommand();
export const summaryCommand: SummaryCommand = new SummaryCommand();

// Arrays
export const pjCommands: Array<ICommand> = [
  gianniCommand,
  gustaveCommand,
  marlaCommand,
  martaCommand,
  michelCommand,
  peterCommand,
  sidoniaCommand,
  thelmaCommand,
];

export const allJdrCommands: Array<ICommand> = [
  ...pjCommands,
  cthulhuCommand,
  summaryCommand,
];
