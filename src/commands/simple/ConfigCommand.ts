import { rankoneLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "config";

const options: CommandOptions = new CommandOptions([
  "config",
  "setup",
  "configuration",
  "matos",
  "materiel",
  "cam",
  "camera",
  "webcam",
  "ordi",
  "pc",
  "ordinateur",
  "clavier",
  "souris",
  "light",
  "lights",
  "casque",
  "micro",
  "son",
  "camescope",
  "ecran",
  "ecrans",
]);
const answer: String = `​Vous pouvez retrouver ma config juste en bas du stream ou ici: ${rankoneLink} (scrollez un peu)`;

export default class ConfigCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
