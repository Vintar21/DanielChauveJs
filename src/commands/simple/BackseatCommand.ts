import { getGamesCategoriesPermissions } from "../../utils/CategoriesConstants";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const categoriesPermissions = getGamesCategoriesPermissions();

const options: CommandOptions = new CommandOptions([
  /bs/i,
  /backseat/i,
  /si[èéêe]ge-?arr?i[éeèê]r+e/i,
])
  .sendAnnounce()
  .setCategoriesPermissions(categoriesPermissions);
const answer: String =
  "​Le backseat c'est donner des conseils ou spoiler des choses dans le jeu alors que le streamer (za zémoi) souhaite découvrir le jeu. Même s'il fait des erreurs tant pis c'est ça aussi le plaisir de la découverte !";

export default class BackseatCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
