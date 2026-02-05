import CommandOptions from "../CommandOptions";
import SimpleCommand from "../SimpleCommand";

export default class ShittyGameCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /(jeux?)?[aà]chi[eéè]r?/i,
  ]);

  private static answer: string =
    "​​Le jeu n'est pas vraiment à chier sinon je n'y jouerais pas. j'extériorise simplement ma frustration et suis vulgaire mais y a r.";

  constructor() {
    super(ShittyGameCommand.options, ShittyGameCommand.answer);
  }
}
