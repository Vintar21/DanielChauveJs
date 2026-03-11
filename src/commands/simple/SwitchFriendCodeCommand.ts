import { switchFriendCode } from "../../config/ConfigLoader";
import {
  ANIMAL_CROSSINGS_SWITCH,
  getNoCategoriesPermissions,
  MARIO_GOLF_SUPERRUSH,
  MARIO_KARTS_SWITCH,
  MARIO_PARTYS_SWITCH,
  MARIO_TENNISES_SWITCH,
  POKEMONS_SWITCH,
  SMASH_BROS_ULTIMATE,
  SPLATOONS_SWITCH,
} from "../../utils/CategoriesConstants";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

// Remove those permissions if you want the command to be always available or add games to the array
const categoriesPermissions = getNoCategoriesPermissions();
categoriesPermissions.allowEach([
  ...MARIO_KARTS_SWITCH,
  ...MARIO_PARTYS_SWITCH,
  ...MARIO_TENNISES_SWITCH,
  MARIO_GOLF_SUPERRUSH,
  ...POKEMONS_SWITCH,
  ...ANIMAL_CROSSINGS_SWITCH,
  ...SPLATOONS_SWITCH,
  SMASH_BROS_ULTIMATE,
]);

const options: CommandOptions = new CommandOptions([
  /code-?ami/i,
]).setCategoriesPermissions(categoriesPermissions);

const answer: String = `​Mon code ami Switch est ${switchFriendCode}`;

export default class SwitchFriendCodeCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
