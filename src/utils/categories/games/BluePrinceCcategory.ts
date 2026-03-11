import { CategoryTags, GameTypes } from "../tags/CategoryTags";
import AGameCategory from "../templates/AGameCategory";

const name = "Blue Prince";
const tags = new CategoryTags()
  .setGameTypes([GameTypes.PUZZLE, GameTypes.ROGUE_LIKE])
  .solo();

const aliases = ["blueprince"];

export default class BluePrinceCategory extends AGameCategory {
  constructor() {
    super(name, aliases, tags);
  }
}
