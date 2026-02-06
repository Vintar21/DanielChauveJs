import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /2k/i,
  /1440p/i,
  /2560p?x1440p?/i,
  /2560p/i,
  /uhd/i,
  /quadhd/i,
]);

const answer: String =
  "​Vous pouvez regardez le stream en 1440p ! Si vous ne voyez pas cette option de qualité, essayez d'activer l'accélération matérielle de votre navigateur. Si ça ne fonctionne toujours pas peut être que votre PC n'est pas compatible";

export default class QuadHdCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
