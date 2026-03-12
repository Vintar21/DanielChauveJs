import { commandsManualLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "commandes";

const options: CommandOptions = new CommandOptions([
  "commande",
  "commands",
  "command",
  "man",
  "manual",
  "manuel",
  /commands?-?list/i,
  /liste(-|des?)commandes?/,
]);

const answer: String = `Vous pouvez retrouver le manuel de mes commandes ici: ${commandsManualLink}`;

export default class CommandsManualCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
