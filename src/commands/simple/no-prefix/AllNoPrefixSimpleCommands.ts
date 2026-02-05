import ICommand from "../../ICommand";
import OuaisOuaisOuaisCommand from "./OuaisOuaisOuaisCommand";

export const ouaisOuaisOuaisCommand: OuaisOuaisOuaisCommand =
  new OuaisOuaisOuaisCommand();

// Arrays
export const allNoPrefixSimpleCommands: Array<ICommand> = [
  ouaisOuaisOuaisCommand,
];
