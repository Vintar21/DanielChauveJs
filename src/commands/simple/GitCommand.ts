import { gitLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "git";

const options: CommandOptions = new CommandOptions(["github"]);
const answer: String = `Et oui il a un github l'autre là, en plus dessus on peut y retrouver mon code: ${gitLink}`;
export default class GitCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
