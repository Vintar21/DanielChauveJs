import CommandOptions from "../CommandOptions";
import DilemmaCommand, { END_POS } from "../templates/DilemmaCommand";

const options: CommandOptions = new CommandOptions([
  /sop/i,
  /smash(or)?pass/i,
  /smash/i,
]);

const answers: String[] = [
  ", c'est un SMASH !",
  ", nan, on passe.",
  ", c'est un ÉNORME SMASH ",
  ", j'ai vomi en voyant ça, on passe.",
];

export default class SmashOrPassCommand extends DilemmaCommand {
  constructor() {
    super(options, answers, END_POS, true);
  }
}
