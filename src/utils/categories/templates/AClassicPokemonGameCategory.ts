import { CategoryTags, GameTypes } from "../tags/CategoryTags";
import AGameCategory from "./AGameCategory";

export default abstract class AClassicPokemonGameCategory extends AGameCategory {
  protected abstract firstVersionNameFr: RegExp | string;
  protected abstract secondVersionNameFr: RegExp | string;

  protected abstract firstVersionNameEn: RegExp | string;
  protected abstract secondVersionNameEn: RegExp | string;

  constructor(
    name: string,
    aliases: Array<RegExp | string> = [],
    tags: CategoryTags = new CategoryTags(),
  ) {
    tags.setGame(true).multi();
    tags.addGameTypes([GameTypes.POKEMON, GameTypes.ADVENTURE]);
    super(name, aliases, tags);
    this.addAliases([this.getClassicPokemonRegex()]);
  }

  protected getClassicPokemonRegex(): RegExp {
    return new RegExp(
      `(?:pokemons?\s(?:[a-z]+\s)?(?:${this.firstVersionNameFr}|${this.secondVersionNameFr}|${this.firstVersionNameEn}|${this.secondVersionNameEn})
        | (?:${this.firstVersionNameFr}|${this.firstVersionNameEn})(?:\s(?:et|and))?\s(?:[a-z]+\s)?(?:${this.secondVersionNameFr}|${this.secondVersionNameEn}))`,
      "gi",
    );
  }
}
