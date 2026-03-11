import { CategoryTags } from "../tags/CategoryTags";
import ATwitchCategory from "./ATwitchCategory";

export default class AGameCategory extends ATwitchCategory {
  constructor(
    name: string,
    aliases: Array<RegExp | string> = [],
    tags: CategoryTags = new CategoryTags(),
  ) {
    tags.setGame(true);
    super(name, aliases, tags);
  }
}
