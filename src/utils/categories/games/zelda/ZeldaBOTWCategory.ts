import { CategoryTags, GameSupports } from "../../tags/CategoryTags";
import AZeldaGameCategory from "../../templates/AZeldaGameCategory";

const name = "The Legend of Zelda: Breath of the Wild";
const tags = new CategoryTags().setGameSupports([
  GameSupports.SWITCH,
  GameSupports.SWITCH2,
]);

const aliases: Array<RegExp | string> = [];

export default class ZeldaBOTWCategory extends AZeldaGameCategory {
  constructor() {
    super(name, aliases, tags);
  }
}
