import { commandsManualLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /commande?s?/i,
  /man(u[ae]l)?/i,
  /commands?-?list/i,
  /liste(-|des?)commandes?/,
]);

const answer: String = `Vous pouvez retrouver le manuel de mes commandes ici: ${commandsManualLink}`;

export default class CommandsManualCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
