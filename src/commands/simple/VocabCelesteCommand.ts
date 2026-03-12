import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "vocab";

const options: CommandOptions = new CommandOptions([
  "vocabulary",
  "vocabulaire",
  "vocabulere",
  "vocabCeleste",
  "vocab-celeste",
  "vocabulaireCeleste",
  "vocabularyCeleste",
  "vocabulereCeleste",
  "vocabulaire-celeste",
  "vocabulary-celeste",
  "vocabulere-celeste",
]);
const answer: String =
  "​Pour plus d'info sur le vocabulaire de speedrun de Celeste: https://celestegame.fandom.com/wiki/Moves";

export default class VocabCelesteCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
