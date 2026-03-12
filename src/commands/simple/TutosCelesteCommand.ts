import { tutosCelestePlaylist } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "tutos";

const options: CommandOptions = new CommandOptions([
  "tuto",
  /tutori[ea]l+e?s?/i,
  /tutos?-?celeste/i,
  /tutori[ea]l+e?s?-?celeste/i,
  /tutos?-?speedrun/i,
  /tutos?-?any%?/i,
]);
const answer: String = `​Pour retrouver mon tuto sur le speedrun Celeste c'est ici: ${tutosCelestePlaylist}`;

export default class TutosCelesteCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
