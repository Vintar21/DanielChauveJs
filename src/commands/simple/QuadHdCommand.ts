import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class QuadHdCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /2k/i,
    /1440p/i,
    /2560p?x1440p?/i,
    /2560p/i,
    /uhd/i,
    /quadhd/i,
  ]);
  private static answer: string =
    "​Vous pouvez regardez le stream en 1440p ! Si vous ne voyez pas cette option de qualité, essayez d'activer l'accélération matérielle de votre navigateur. Si ça ne fonctionne toujours pas peut être que votre PC n'est pas compatible";

  constructor() {
    super(QuadHdCommand.options, QuadHdCommand.answer);
  }
}
