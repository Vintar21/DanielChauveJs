import {
  getCategoryPermissions,
  TABLETOP_RPG,
} from "../../../utils/CategoriesConstants";
import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "marta";

const categoriesPermissions = getCategoryPermissions(TABLETOP_RPG);

const options: CommandOptions = new CommandOptions([]).setCategoriesPermissions(
  categoriesPermissions,
);

const answer: String =
  JDR_PJ_MESSAGE_START + "Marta: https://ibb.co/ymHxJmpS 📚";

export default class MartaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
