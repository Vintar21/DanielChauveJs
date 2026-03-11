import { CategoryTags, GameSupports } from "../../tags/CategoryTags";
import AZeldaGameCategory from "../../templates/AZeldaGameCategory";

const name = "The Legend of Zelda: Skyward Sword HD";
const tags = new CategoryTags().setGameSupports([
  GameSupports.SWITCH,
  GameSupports.WII,
]);

const aliases: Array<RegExp | string> = [];

export default class ZeldaSSCategory extends AZeldaGameCategory {
  constructor() {
    super(name, aliases, tags);
  }
}
