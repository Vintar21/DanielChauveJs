import { rankoneLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /config/i,
  /setup/i,
  /configuration/i,
  /matos/i,
  /mat[éeèê]riel(le)?/i,
  /(web)?cam([éeèê]ra)/i,
  /ordi(nateur)/i,
  /clavier/i,
  /souris/i,
  /lights?/i,
  /casque/i,
  /micros?/i,
  /son/i,
  /cam[eéê]scope/i,
  /[éeêè]crans?/i,
]);
const answer: String = `​Vous pouvez retrouver ma config juste en bas du stream ou ici: ${rankoneLink} (scrollez un peu)`;

export default class ConfigCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
