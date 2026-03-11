import { CategoryTags } from "../tags/CategoryTags";
import ANoGameCategory from "../templates/ANoGameCategory";

const name = "Just Chatting";
const tags = new CategoryTags();

const aliases = [/(?:discuss?ions?|(juste?[-_\s])?chatt?ing|blabla)/gi];

export default class JustChattingCategory extends ANoGameCategory {
  constructor() {
    super(name, aliases, tags);
  }
}
