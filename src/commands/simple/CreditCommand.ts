import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class CreditCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /cr[eéèê]dits?/i,
    /artistes?/i,
    /badges?/i,
    /emotes?/i,
    /waiting-?(screen)?/i,
  ]);
  private static answer: string =
    "​Les emotes sont attribuées à leur créateurices. Les badges de sub ont été fait par Caudiptera. L'image de fond a été faite par Ultio_";

  constructor() {
    super(CreditCommand.options, CreditCommand.answer);
  }
}
