import { chaiseClip } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class ChaiseCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /chaise/i,
    /(clip-?)?chaise(-?clip)?/i,
  ]);

  //TODO: hide links
  private static answer: string = `​Démonstration de la gravité: ${chaiseClip}`;

  constructor() {
    super(ChaiseCommand.options, ChaiseCommand.answer);
  }
}
