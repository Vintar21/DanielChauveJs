import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class VocabCelesteCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /vocab/i,
    /vocabulary/i,
    /vocabul(ai|[eéèê])re/i,
    /vocab-?celeste/i,
    /vocabulary-?celeste/i,
    /vocabul(ai|[eéèê])re-?celeste/i,
  ]);
  private static answer: string =
    "​Pour plus d'info sur le vocabulaire de speedrun de Celeste: https://celestegame.fandom.com/wiki/Moves";

  constructor() {
    super(VocabCelesteCommand.options, VocabCelesteCommand.answer);
  }
}
