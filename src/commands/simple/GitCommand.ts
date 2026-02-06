import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";
import { gitLink } from "../../config/ConfigLoader";

export default class GitCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/git(hub)?/i]);
  private static answer: string = `Et oui il a un github l'autre là, en plus dessus on peut y retrouver mon code: ${gitLink}`;

  constructor() {
    super(GitCommand.options, GitCommand.answer);
  }
}
