import CommandOptions from "../../options/CommandOptions";
import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import SimpleCommand from "../../templates/SimpleCommand";
import {
  getCategoryPermissions,
  TABLETOP_RPG,
} from "../../../utils/CategoriesConstants";

const mainTrigger: string = "gianni";

const categoriesPermissions = getCategoryPermissions(TABLETOP_RPG);

const options: CommandOptions = new CommandOptions([
  /[gj]iann?i/i,
]).setCategoriesPermissions(categoriesPermissions);

const answer: String =
  JDR_PJ_MESSAGE_START + "Gianni: https://ibb.co/mFhskd5n 🇮🇹";

export default class GianniCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
