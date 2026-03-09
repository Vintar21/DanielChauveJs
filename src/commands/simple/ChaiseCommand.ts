import { chaiseClip } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /chaise/i,
  /(clip-?)?chaise(-?clip)?/i,
]);

const answer: String = `​Démonstration de la gravité:: ${chaiseClip}`;

export default class ChaiseCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
