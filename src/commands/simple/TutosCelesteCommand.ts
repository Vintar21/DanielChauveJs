import { tutosCelestePlaylist } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class TutosCelesteCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /tuto/i,
    /tutori[ea]l+e?s?/i,
    /tuto-?celeste/i,
    /tutori[ea]l+e?s?-?celeste/i,
    /tuto-?speedrun/i,
    /tuto-?any%?/i,
  ]);
  private static answer: string = `​Pour retrouver mon tuto sur le speedrun Celeste c'est ici: ${tutosCelestePlaylist}`;

  constructor() {
    super(TutosCelesteCommand.options, TutosCelesteCommand.answer);
  }
}
