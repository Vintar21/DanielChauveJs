import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /cr[eéèê]dits?/i,
  /artistes?/i,
  /badges?/i,
  /emotes?/i,
  /waiting-?(screen)?/i,
]);
const answer: String =
  "​Les emotes sont attribuées à leur créateurices. Les badges de sub ont été fait par Caudiptera. L'image de fond a été faite par Ultio_";

export default class CreditCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
