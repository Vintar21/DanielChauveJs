import { CategoryTags, GameSupports } from "../../tags/CategoryTags";
import AZeldaGameCategory from "../../templates/AZeldaGameCategory";

const name = "The Legend of Zelda: Tears of the Kingdom";
const tags = new CategoryTags().setGameSupports([
  GameSupports.SWITCH,
  GameSupports.SWITCH2,
]);

const aliases: Array<RegExp | string> = [];

export default class ZeldaTOTKCategory extends AZeldaGameCategory {
  constructor() {
    super(name, aliases, tags);
  }
}
