import { tutosCelestePlaylist } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /tuto/i,
  /tutori[ea]l+e?s?/i,
  /tuto-?celeste/i,
  /tutori[ea]l+e?s?-?celeste/i,
  /tuto-?speedrun/i,
  /tuto-?any%?/i,
]);
const answer: String = `​Pour retrouver mon tuto sur le speedrun Celeste c'est ici: ${tutosCelestePlaylist}`;

export default class TutosCelesteCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
