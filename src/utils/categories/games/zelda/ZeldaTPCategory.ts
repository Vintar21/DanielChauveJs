import { CategoryTags, GameSupports } from "../../tags/CategoryTags";
import AZeldaGameCategory from "../../templates/AZeldaGameCategory";

const name = "The Legend of Zelda: Twilight Princess";
const tags = new CategoryTags().setGameSupports([
  GameSupports.GAMECUBE,
  GameSupports.WII_U,
]);

const aliases: Array<RegExp | string> = [];

export default class ZeldaTPCategory extends AZeldaGameCategory {
  constructor() {
    super(name, aliases, tags);
  }
}
