import { CategoryTags, GameSupports } from "../../tags/CategoryTags";
import AClassicPokemonGameCategory from "../../templates/AClassicPokemonGameCategory";

const name = "Pokémon Scarlet/Violet";
const tags = new CategoryTags().setGameSupports([GameSupports.SWITCH]);

const aliases = ["pokemon sv", "pokemon ev"];

export default class PokemonScarletVioletCategory extends AClassicPokemonGameCategory {
  protected firstVersionNameFr: RegExp = /ecarlates?/g;
  protected secondVersionNameFr: RegExp = /viol+et?s?/g;

  protected firstVersionNameEn: RegExp = /scarlet(?:te)?s?/g;
  protected secondVersionNameEn: RegExp = /viol+ets?/g;

  constructor() {
    super(name, aliases, tags);
  }
}
