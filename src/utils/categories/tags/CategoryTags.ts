export type GameSupport = string;

export const GameSupports = Object.freeze({
  // Misc
  PC: "pc",
  MOBILE: "mobile",
  // Nintendo
  GAMECUBE: "gc",
  WII: "wii",
  WII_U: "wii u",
  DS: "ds",
  DS_3D: "3ds",
  SWITCH: "switch",
  SWITCH2: "switch2",
  // Sony
  PS1: "ps1",
  PS2: "ps2",
  PS3: "ps3",
  PS4: "ps4",
  PS5: "ps5",
  // Microsoft
  XBOX: "xbox",
  XBOX_360: "xbox 360",
  XBOX_ONE: "xbox one",
  XBOX_SERIES: "xbox series",
});

export type GameType = string;

// Game type and licences (You may want to enrich it by yourself)
export const GameTypes = Object.freeze({
  // Misc
  ACTION: "action",
  ADVENTURE: "adventure",
  DECK_BUILDING: "deck building",
  FPS: "fps",
  HORROR: "horror",
  METROID_VANILLA: "metroid_vanilla",
  MMO: "mmo",
  NARRATIVE: "narrative",
  PLATFORMER: "platformer",
  PUZZLE: "puzzle",
  RACE: "race",
  ROGUE_LIKE: "rogue like",
  RPG: "rpg",
  SIMULATION: "simulation",
  SOULS_LIKE: "souls",
  SPORTS: "sports",
  TCG: "tcg",

  // Nintendo
  MARIO: "mario",
  POKEMON: "pokemon",
  ZELDA: "zelda",

  // Ubisoft
  ASSASSINS_CREED: "assassin's creed",
  TRACKMANIA: "trackmania",
});

export class CategoryTags {
  game: boolean = true;
  gameTypes: Set<GameType> = new Set();
  multiplayer: boolean = false;

  gameSupports: Set<GameSupport> = new Set();

  constructor() {}

  public setGame(isAGame: boolean): CategoryTags {
    this.game = isAGame;
    return this;
  }

  public solo(): CategoryTags {
    this.multiplayer = false;
    return this;
  }

  public multi(): CategoryTags {
    this.multiplayer = true;
    return this;
  }

  public addGameTypes(gameTypes: GameType[]): CategoryTags {
    gameTypes.forEach((gameType) => this.gameTypes.add(gameType));
    return this;
  }

  public addGameSupports(gameSupports: GameSupport[]): CategoryTags {
    gameSupports.forEach((gameSupport) => this.gameSupports.add(gameSupport));
    return this;
  }

  public setGameTypes(gameTypes: GameType[]): CategoryTags {
    this.gameTypes.clear();
    gameTypes.forEach((gameType) => this.gameTypes.add(gameType));
    return this;
  }

  public setGameSupports(gameSupports: GameSupport[]): CategoryTags {
    this.gameSupports.clear();
    gameSupports.forEach((gameSupport) => this.gameSupports.add(gameSupport));
    return this;
  }
}
