import { CategoryTags, GameSupports } from "../../tags/CategoryTags";
import AClassicPokemonGameCategory from "../../templates/AClassicPokemonGameCategory";

const name = "Pokémon Sword/Shield";
const tags = new CategoryTags().setGameSupports([GameSupports.SWITCH]);

const aliases = ["pokemon ss", "pokemon eb"];

export default class PokemonSwordShieldCategory extends AClassicPokemonGameCategory {
  protected firstVersionNameFr: RegExp = /ep+ees?/g;
  protected secondVersionNameFr: RegExp = /bouclier?s?/g;

  protected firstVersionNameEn: RegExp = /swords?/g;
  protected secondVersionNameEn: RegExp = /shields?/g;

  constructor() {
    super(name, aliases, tags);
  }
}
