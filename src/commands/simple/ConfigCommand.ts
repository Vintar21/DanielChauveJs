import { rankoneLink } from "../../utils/ImportConstants";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class ConfigCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
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
  private static answer: string = `​Vous pouvez retrouver ma config juste en bas du stream ou ici: ${rankoneLink} (scrollez un peu)`;

  constructor() {
    super(ConfigCommand.options, ConfigCommand.answer);
  }
}
