import { minutes } from "../../utils/CommonUtils";
import CommandOptions from "../CommandOptions";
import DilemmaCommand, { END_POS } from "../templates/DilemmaCommand";

const options: CommandOptions = new CommandOptions([
  /10/i,
  /dix(mais)?/i,
  /ten(but)?/i,
  /(it'?sa?|c'estun)10/i,
]).setUserCooldown(minutes(5));

const answers: string[] = [
  " ? C'est toujours un·e 10 !",
  " ? En vrai je suis un peu curieux, c'est un·e 9 !",
  " ? J'avoue ça me dérange pas, c'est un·e 8 !",
  " ? Boarf franchement c'est un bon 7 !",
  " ? Si vraiment y a que ça c'est un·e 6.",
  " ? Mouais allez c'est un·e 5.",
  " ? C'est... intéressant: 4.",
  " ? Bourré à 4h du mat peut être, c'est un·e 3...",
  " ? Nan là c'est compliqué quand même, c'est un·e 2.",
  " ? Qui fait ça même ? C'est un·e 1.",
  " ? EEWWW c'est un·e 0, ça va pas nan ?",
  " ? C'est un·e 100 😋 !",
  " ???? C'est un·e -1000, c'est pas interdit par les lois internationales ça ?",
  " ? J'avoue ça m'arrive aussi... c'est un·e 10 !",
];

export default class ItsATenButCommand extends DilemmaCommand {
  constructor() {
    super(options, answers, END_POS, true);
  }
}
