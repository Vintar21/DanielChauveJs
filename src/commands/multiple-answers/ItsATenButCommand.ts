import { minutes } from "../../utils/CommonUtils";
import CommandOptions from "../options/CommandOptions";
import { Placeholders } from "../../utils/CommandsUtils";
import DilemmaCommand from "../templates/DilemmaCommand";

const options: CommandOptions = new CommandOptions([
  /10/i,
  /dix(mais)?/i,
  /ten(but)?/i,
  /(it'?sa?|c'?estun)10/i,
]).setUserCooldown(minutes(5));

const answers: string[] = [
  `${Placeholders.INPUT} ? C'est toujours un·e 10 !`,
  `${Placeholders.INPUT} ? En vrai je suis un peu curieux, c'est un·e 9 !`,
  `${Placeholders.INPUT} ? J'avoue ça me dérange pas, c'est un·e 8 !`,
  `${Placeholders.INPUT} ? Boarf franchement c'est un bon 7 !`,
  `${Placeholders.INPUT} ? Si vraiment y a que ça c'est un·e 6.`,
  `${Placeholders.INPUT} ? Mouais allez c'est un·e 5.`,
  `${Placeholders.INPUT} ? C'est... intéressant: 4.`,
  `${Placeholders.INPUT} ? Bourré à 4h du mat peut être, c'est un·e 3...`,
  `${Placeholders.INPUT} ? Nan là c'est compliqué quand même, c'est un·e 2.`,
  `${Placeholders.INPUT} ? Qui fait ça même ? C'est un·e 1.`,
  `${Placeholders.INPUT} ? EEWWW c'est un·e 0, ça va pas nan ?`,
  `${Placeholders.INPUT} ? C'est un·e 100 😋 !`,
  `${Placeholders.INPUT} ???? C'est un·e -1000, c'est pas interdit par les lois internationales ça ?`,
  `${Placeholders.INPUT} ? J'avoue ça m'arrive aussi... c'est un·e 10 !`,
];

export default class ItsATenButCommand extends DilemmaCommand {
  constructor() {
    super(options, answers, true);
  }
}
