import { EMPTY, MINUS, SPACE } from "../../StringConstants";
import { CategoryTags, GameTypes } from "../tags/CategoryTags";
import AGameCategory from "./AGameCategory";

export default abstract class AZeldaGameCategory extends AGameCategory {
  // The space at the end is important !
  protected static GAME_NAME_PREFIX = "The Legend of Zelda: ";

  constructor(
    name: string,
    aliases: Array<RegExp | string> = [],
    tags: CategoryTags = new CategoryTags(),
  ) {
    tags.solo().setGameTypes([GameTypes.ZELDA, GameTypes.ADVENTURE]);
    super(name, aliases, tags);
    this.addAliases([this.getZeldaAlias()]);
  }

  protected getZeldaAlias() {
    var zeldaName = this.name.slice(AZeldaGameCategory.GAME_NAME_PREFIX.length);
    const minusIndex = this.name.indexOf(MINUS);

    // Ignore special editions
    if (minusIndex && minusIndex > 0) {
      zeldaName = zeldaName.slice(0, minusIndex);
    }

    const parts = zeldaName
      .replaceAll(/HD\s+$/g, EMPTY)
      .toLowerCase()
      .trim()
      .split(SPACE);

    var alias = "zelda ";
    parts.forEach((word) => (alias += word[0]));
    return alias;
  }
}
