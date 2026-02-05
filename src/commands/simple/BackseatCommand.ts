import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class BackseatCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /bs/i,
    /backseat/i,
    /si[èéêe]ge-?arr?i[éeèê]r+e/i,
  ]);
  private static answer: string =
    "​Le backseat c'est donner des conseils ou spoiler des choses dans le jeu alors que le streamer (za zémoi) souhaite découvrir le jeu. Même s'il fait des erreurs tant pis c'est ça aussi le plaisir de la découverte !";

  constructor() {
    super(BackseatCommand.options, BackseatCommand.answer);
  }
}
