import { gitLink } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/git(hub)?/i]);
const answer: String = `Et oui il a un github l'autre là, en plus dessus on peut y retrouver mon code: ${gitLink}`;
export default class GitCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
