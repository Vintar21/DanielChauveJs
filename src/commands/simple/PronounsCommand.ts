import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class PronounsCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /prono[mn]s?/i,
    /pronouns?/i,
    /genres?/i,
  ]);
  private static answer: string =
    "​Pour afficher votre pronom, c'est ici: https://pronouns.alejo.io Pour voir les pronoms des gens, il y a cette extension Chrome: https://urlz.fr/oXdh ou Firefox: https://urlz.fr/oXdk !";

  constructor() {
    super(PronounsCommand.options, PronounsCommand.answer);
  }
}
