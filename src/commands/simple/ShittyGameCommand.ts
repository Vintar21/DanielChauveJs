import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/(jeux?)?[aà]chi[eéè]r?/i]);

const answer: String =
  "​​Le jeu n'est pas vraiment à chier sinon je n'y jouerais pas. J'extériorise simplement ma frustration et suis vulgaire mais y a r.";

export default class ShittyGameCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
