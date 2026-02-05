import { pbCelesteVOD, speedrunComLink } from "../../utils/ImportConstants";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class PbCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /pb/i,
    /personalbest/i,
    /(pb)?-?celeste-?(pb)?/i,
    /(pb)?-?supermarket-?(together)?-?(pb)?/i,
    /speedrun(\.com)?/i,
  ]);
  private static answer: string = `​Mon PB sur Celeste en Any% est de 41:05.782 (${pbCelesteVOD}). Sur SuperMarket Together avec Moustique nous sommes à 4:46. Vous pouvez tout retrouver sur ma page speedrun.com ${speedrunComLink}`;

  constructor() {
    super(PbCommand.options, PbCommand.answer);
  }
}
