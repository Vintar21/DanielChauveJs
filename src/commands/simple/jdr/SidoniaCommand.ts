import CommandOptions from "../../options/CommandOptions";
import { JDR_PJ_MESSAGE_START } from "../../../utils/CommandsUtils";
import SimpleCommand from "../../templates/SimpleCommand";
import {
  getCategoryPermissions,
  TABLETOP_RPG,
} from "../../../utils/CategoriesConstants";

const mainTrigger: string = "sidonia";

const categoriesPermissions = getCategoryPermissions(TABLETOP_RPG);

const options: CommandOptions = new CommandOptions([]).setCategoriesPermissions(
  categoriesPermissions,
);

const answer: String =
  JDR_PJ_MESSAGE_START + "Sidonia: https://ibb.co/RGTnMKYT 🦝";

export default class SidoniaCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
