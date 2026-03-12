import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "pronoms";

const options: CommandOptions = new CommandOptions([
  "pronom",
  "pronouns",
  "pronoun",
]);
const answer: String =
  "​Pour afficher votre pronom, c'est ici: https://pronouns.alejo.io Pour voir les pronoms des gens, il y a cette extension Chrome: https://urlz.fr/oXdh ou Firefox: https://urlz.fr/oXdk !";

export default class PronounsCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
