import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/ch?th?uh?lh?uh?/i]);
const answer: String =
  "L'appel de Cthulhu est un JdR enquête/horreur se plaçant dans les USA des années 1920. Nos protagonistes ont pour but d'investiguer sur des faits étranges aux quatre coins du pays et de régler les soucis en toute discrétion. On joue avec des dés 100 qui représente un pourcentage de réussite: 1 est un succès critique et de 96 à 100 un échec critique !";

export default class CthulhuCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
