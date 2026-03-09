import { pbCelesteVOD, speedrunComLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /pb/i,
  /personalbest/i,
  /(pb)?-?celeste-?(pb)?/i,
  /(pb)?-?supermarket-?(together)?-?(pb)?/i,
  /speedrun(\.com)?/i,
]);
const answer: String = `​Mon PB sur Celeste en any% est de 41:05.782 (${pbCelesteVOD}). Sur SuperMarket Together avec Moustique nous sommes à 4:46. Vous pouvez tout retrouver sur ma page speedrun.com ${speedrunComLink}`;

export default class PbCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
