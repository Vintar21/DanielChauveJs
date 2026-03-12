import CommandOptions from "../options/CommandOptions";
import { Placeholders } from "../../utils/CommandsUtils";
import DilemmaCommand from "../templates/DilemmaCommand";

const mainTrigger: string = "smash";

const options: CommandOptions = new CommandOptions([
  "sop",
  /smash(or)?pass/i,
]).setGlobalCooldown(15);

const answers: String[] = [
  `${Placeholders.INPUT}, c'est un SMASH !`,
  `${Placeholders.INPUT}, nan, on passe.`,
  `${Placeholders.INPUT}, c'est un ÉNORME SMASH `,
  `${Placeholders.INPUT}, j'ai vomi en voyant ça, on passe.`,
];

export default class SmashOrPassCommand extends DilemmaCommand {
  constructor() {
    super(mainTrigger, options, answers, true);
  }
}
