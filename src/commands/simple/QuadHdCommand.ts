import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "2k";

const options: CommandOptions = new CommandOptions([
  "1440p",
  "2560x1440",
  "2560p",
  "uhd",
  "quadhd",
]);

const answer: String =
  "​Vous pouvez regardez le stream en 1440p ! Si vous ne voyez pas cette option de qualité, essayez d'activer l'accélération matérielle de votre navigateur. Si ça ne fonctionne toujours pas peut être que votre PC n'est pas compatible";

export default class QuadHdCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
