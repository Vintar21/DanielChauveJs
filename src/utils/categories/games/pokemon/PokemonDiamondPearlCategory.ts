import { CategoryTags, GameSupports } from "../../tags/CategoryTags";
import AClassicPokemonGameCategory from "../../templates/AClassicPokemonGameCategory";

const name = "Pokémon Brilliant Diamond/Shining Pearl";
const tags = new CategoryTags().setGameSupports([
  GameSupports.SWITCH,
  GameSupports.DS,
]);

const aliases = ["pokemon dp", "pokemon bdsp", "pokemon deps"];

export default class PokemonDiamondPearlCategory extends AClassicPokemonGameCategory {
  protected firstVersionNameFr: RegExp = /diam[ae]nt?s?/g;
  protected secondVersionNameFr: RegExp = /perles?/g;

  protected firstVersionNameEn: RegExp = /diamonds?/g;
  protected secondVersionNameEn: RegExp = /pearls?/g;

  constructor() {
    super(name, aliases, tags);
  }
}
