import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /vocab/i,
  /vocabulary/i,
  /vocabul(ai|[eéèê])re/i,
  /vocab-?celeste/i,
  /vocabulary-?celeste/i,
  /vocabul(ai|[eéèê])re-?celeste/i,
]);
const answer: String =
  "​Pour plus d'info sur le vocabulaire de speedrun de Celeste:: https://celestegame.fandom.com/wiki/Moves";

export default class VocabCelesteCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
