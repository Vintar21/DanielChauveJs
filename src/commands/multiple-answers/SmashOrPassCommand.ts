import CommandOptions from "../options/CommandOptions";
import { Placeholders } from "../../utils/CommandsUtils";
import DilemmaCommand from "../templates/DilemmaCommand";

const options: CommandOptions = new CommandOptions([
  /sop/i,
  /smash(or)?pass/i,
  /smash/i,
]).setGlobalCooldown(15);

const answers: String[] = [
  `${Placeholders.INPUT}, c'est un SMASH !`,
  `${Placeholders.INPUT}, nan, on passe.`,
  `${Placeholders.INPUT}, c'est un ÉNORME SMASH `,
  `${Placeholders.INPUT}, j'ai vomi en voyant ça, on passe.`,
];

export default class SmashOrPassCommand extends DilemmaCommand {
  constructor() {
    super(options, answers, true);
  }
}
