import { CategoryTags } from "../tags/CategoryTags";
import ATwitchCategory from "./ATwitchCategory";

export default class ANoGameCategory extends ATwitchCategory {
  constructor(
    name: string,
    aliases: Array<RegExp | string> = [],
    tags: CategoryTags = new CategoryTags(),
  ) {
    tags.setGame(false);
    tags.setGameSupports([]);
    tags.setGameTypes([]);
    super(name, aliases, tags);
  }
}
