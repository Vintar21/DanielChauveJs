import { Permissions } from "./permissions/Permissions";

export type Category = string;

// Allow all categories by default
export function getDefaultCategoriesPermissions(): Permissions<Category> {
  const defaultCategoriesPermissions: Permissions<Category> = new Permissions();
  defaultCategoriesPermissions.allowDefault();
  return defaultCategoriesPermissions;
}

// Unallow all categories by default
export function getNoCategoriesPermissions(): Permissions<Category> {
  const noCategories: Permissions<Category> = new Permissions();
  noCategories.unallowDefault();
  return noCategories;
}

// Unallow all categories by default except the one given
export function getCategoryPermissions(
  category: Category,
): Permissions<Category> {
  const categoriesPermissions: Permissions<Category> =
    getNoCategoriesPermissions();
  categoriesPermissions.allow(category);
  return categoriesPermissions;
}

// Unallow all categories by default except the ones given
export function getCategoriesPermissions(
  categories: Category[],
): Permissions<Category> {
  const categoriesPermissions: Permissions<Category> =
    getNoCategoriesPermissions();
  categoriesPermissions.allowEach(categories);
  return categoriesPermissions;
}

// Allow all categories except non-game categories (non-exhaustive)
export function getGamesCategoriesPermissions(): Permissions<Category> {
  const gameCategoriesPermissions: Permissions<Category> =
    getDefaultCategoriesPermissions();
  gameCategoriesPermissions.unallowEach(NOT_GAMES);
  return gameCategoriesPermissions;
}

// Unallow all categories except non-game categories (non-exhaustive)
export function getNotGamesCategoriesPermissions(): Permissions<Category> {
  const notGameCategoriesPermissions: Permissions<Category> =
    getNoCategoriesPermissions();
  notGameCategoriesPermissions.allowEach(NOT_GAMES);
  return notGameCategoriesPermissions;
}

// No game categories
export const JUST_CHATTING: Category = "Just Chatting";

export const ANIMALS: Category = "Animals, Aquariums, and Zoos";
export const ART: Category = "Art";
export const CRAFTING: Category = "Makers & Crafting";
export const DJ: Category = "DJs";
export const IRL: Category = "IRL";
export const MUSIC: Category = "Music";
export const SCIENCE: Category = "Science & Technology";
export const SPORT: Category = "Sports";
export const STUDYING: Category = "Co-working & Studying";
export const TALKSHOWS: Category = "Talk Shows & Podcasts";
export const TABLETOP_RPG: Category = "Tabletop RPGs";

export const NOT_GAMES: Category[] = [
  JUST_CHATTING,
  ANIMALS,
  ART,
  CRAFTING,
  DJ,
  IRL,
  MUSIC,
  SCIENCE,
  SPORT,
  STUDYING,
  TALKSHOWS,
  TABLETOP_RPG,
];

// Game categories
export const BLUE_PRINCE: Category = "Blue Prince";
export const PEAK: Category = "PEAK";
export const TRACKMANIA: Category = "Trackmania";
export const ZELDA_TP: Category = "The Legend of Zelda: Twilight Princess";

// Nintendo Switch & Switch 2

// ----- Mario Kart
export const MARIO_KART_8: Category = "Mario Kart 8";
export const MARIO_KART_8_DELUXE: Category = "Mario Kart 8 Deluxe";
export const MARIO_KART_WORLD: Category = "Mario Kart World";

export const MARIO_KARTS_SWITCH: Category[] = [
  MARIO_KART_8,
  MARIO_KART_8_DELUXE,
  MARIO_KART_WORLD,
];

// ----- Mario Party
export const SUPER_MARIO_PARTY: Category = "Super Mario Party";
export const SUPER_MARIO_PARTY_JAMBOREE: Category =
  "Super Mario Party Jamboree";
export const SUPER_MARIO_PARTY_JAMBOREE_SWITCH_2: Category =
  "Super Mario Party Jamboree: Nintendo Switch 2 Edition + Jamboree TV";
export const MARIO_PARTY_SUPERSTARS: Category = "Mario Party Superstars";

export const MARIO_PARTYS_SWITCH: Category[] = [
  SUPER_MARIO_PARTY,
  SUPER_MARIO_PARTY_JAMBOREE,
  SUPER_MARIO_PARTY_JAMBOREE_SWITCH_2,
  MARIO_PARTY_SUPERSTARS,
];

// ----- Mario Tennis
export const MARIO_TENNIS_ACES: Category = "Mario Tennis Aces";
export const MARIO_TENNIS_FEVER: Category = "Mario Tennis Fever";

export const MARIO_TENNISES_SWITCH: Category[] = [
  MARIO_TENNIS_ACES,
  MARIO_TENNIS_FEVER,
];

// ----- Mario Golf
export const MARIO_GOLF_SUPERRUSH: Category = "Mario Golf: Super Rush";

// ----- Pokemon
export const POKEMON_SWORD_SHIELD: Category = "Pokémon Sword/Shield";
export const POKEMON_SWORD: Category = "Pokémon Sword";
export const POKEMON_SHIELD: Category = "Pokémon Shield";

export const POKEMON_SCARLET_VIOLET: Category = "Pokémon Scarlet/Violet";

export const POKEMON_DIAMANT_PEARL_REMAKE: Category =
  "Pokémon Brilliant Diamond/Shining Pearl";

export const POKEMON_LEGENDS_ZA: Category = "Pokémon Legends: Z-A";
export const POKEMON_ARCEUS: Category = "Pokémon Legends: Arceus";

export const POKEMON_LETS_GO: Category = "Pokémon: Let's Go, Pikachu!/Eevee!";

export const POKEMON_POKOPIA: Category = "Pokémon Pokopia";

export const POKEMONS_SWITCH: Category[] = [
  POKEMON_SWORD_SHIELD,
  POKEMON_SWORD,
  POKEMON_SHIELD,
  POKEMON_SCARLET_VIOLET,
  POKEMON_DIAMANT_PEARL_REMAKE,
  POKEMON_LEGENDS_ZA,
  POKEMON_ARCEUS,
  POKEMON_LETS_GO,
  POKEMON_POKOPIA,
];

// ----- Animal Crossing
export const ANIMAL_CROSSING: Category = "Animal Crossing";
export const ANIMAL_CROSSING_NEW_HORIZONS: Category =
  "Animal Crossing: New Horizons";

export const ANIMAL_CROSSINGS_SWITCH: Category[] = [
  ANIMAL_CROSSING,
  ANIMAL_CROSSING_NEW_HORIZONS,
];

// ----- Zelda
export const ZELDA_BOTW: Category = "The Legend of Zelda: Breath of the Wild";
export const ZELDA_BOTW_SWITCH_2: Category =
  "The Legend of Zelda: Breath of the Wild - Nintendo Switch 2 Edition";
export const ZELDA_TOTK: Category = "The Legend of Zelda: Tears of the Kingdom";
export const ZELDA_TOTK_SWITCH_2: Category =
  "The Legend of Zelda: Tears of the Kingdom - Nintendo Switch 2 Edition";
export const ZELDA_SKYWARD_SWORD_HD: Category =
  "The Legend of Zelda: Skyward Sword HD";
export const ZELDA_ECHOES_OF_WISDOM: Category =
  "The Legend of Zelda: Echoes of Wisdom";

// Splatoon
export const SPLATOON_2: Category = "Splatoon 2";
export const SPLATOON_3: Category = "Splatoon 3";

export const SPLATOONS_SWITCH: Category[] = [SPLATOON_2, SPLATOON_3];

// ----- Misc
export const SUPER_MARIO_ODYSSEY: Category = "Super Mario Odyssey";
export const SMASH_BROS_ULTIMATE: Category = "Super Smash Bros. Ultimate";
