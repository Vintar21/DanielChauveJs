import { ChatMessage } from "@twurple/chat";
import { MainApp } from "../../app";
import {
  Category,
  JUST_CHATTING,
  MARIO_KART_8_DELUXE,
  MARIO_KART_WORLD,
  POKEMON_SCARLET_VIOLET,
  POKEMON_SWORD_SHIELD,
  ZELDA_BOTW,
  ZELDA_BOTW_SWITCH_2,
  ZELDA_TOTK,
  ZELDA_TOTK_SWITCH_2,
  ZELDA_TP,
} from "../../utils/CategoriesConstants";
import { Permissions } from "../../utils/permissions/Permissions";
import { getVipOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";

const mainTrigger: string = "setGame";

const rolesPermissions: Permissions<Role> = getVipOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  "updateGame",
  "game",
  "setCategory",
  "updateCategory",
  "category",
]).setRolesPermission(rolesPermissions);

// Change the current category and handling some aliases for some games
export default class SetCategory extends AArgumentsCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  protected async executeWithArgs(
    user: User,
    chatMessage: ChatMessage,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void> {
    if (args.length === 0) {
      this.replyOrSend(
        user,
        chatMessage,
        ignoreCooldowns,
        "Bah donne une catégorie ptêtre nan ??",
      );
      return;
    }

    const twitchClient = MainApp.getTwitchClient();

    // Remove everything except letters and numbers and spaces in the given category
    const givenCategory = args
      .join(SPACE)
      .replaceAll(/[^a-z0-9]/gi, SPACE)
      .trim();
    var detectedCategory: Category = givenCategory;

    // TODO: create a class TwitchCategory which has aliases and equivalent categories (ie MK8 and MK8 deluxe)

    if (
      givenCategory.match(/(?:discuss?ions?|(juste?[-_\s])?chatt?ing|blabla)/gi)
    ) {
      // Just Chatting
      detectedCategory = JUST_CHATTING;
    } else if (givenCategory.match(/m(?:ario\s)?k(?:art)?\s?8/gi)) {
      // MK8
      detectedCategory = MARIO_KART_8_DELUXE;
    } else if (givenCategory.match(/m(?:ario\s)?k(?:art)?\s?worlds?/gi)) {
      // MK World
      detectedCategory = MARIO_KART_WORLD;
    } else if (givenCategory.match(/(?:twilight\sprincess|zelda\stp)/gi)) {
      // Twilight Princess
      detectedCategory = ZELDA_TP;
    } else if (
      givenCategory.match(/b(?:reath\s)?o(?:f\s)?t(?:he\s)?w(?:ild)?/gi)
    ) {
      // BOTW
      if (givenCategory.includes("2")) {
        detectedCategory = ZELDA_BOTW_SWITCH_2;
      } else {
        detectedCategory = ZELDA_BOTW;
      }
    } else if (
      givenCategory.match(/t(?:ears?)?o(?:f)?t(?:he)?k(?:ingdoms?)?/gi)
    ) {
      // TOTK
      if (givenCategory.includes("2")) {
        detectedCategory = ZELDA_TOTK_SWITCH_2;
      } else {
        detectedCategory = ZELDA_TOTK;
      }
    } else if (
      givenCategory.match(
        this.getClassicPokemonRegex(
          /[éèêe]p+[éèêe]es?/,
          /boucli[éèêe]r?s?/,
          /swords?/,
          /shields?/,
        ),
      )
    ) {
      // Pokémon Sword and Shield
      detectedCategory = POKEMON_SWORD_SHIELD;
    } else if (
      givenCategory.match(
        this.getClassicPokemonRegex(
          /[éèêe]carlates?/,
          /viol+[éèêe]t?s?/,
          /scarlet(te)?s?/,
          /viol+ets?/,
        ),
      )
    ) {
      // Pokémon Scarlet and Violet
      detectedCategory = POKEMON_SCARLET_VIOLET;
    } else if (
      givenCategory.match(
        this.getClassicPokemonRegex(
          /diam[ae]nt?s?/,
          /p[éèêe]rle?s?/,
          /diamonds?/,
          /pearls?/,
        ),
      )
    ) {
      // Pokémon Scarlet and Violet
      detectedCategory = POKEMON_SCARLET_VIOLET;
    }

    const isCategoryUpdated =
      await twitchClient.setCurrentGame(detectedCategory);

    if (isCategoryUpdated) {
      this.replyOrSend(
        user,
        chatMessage,
        ignoreCooldowns,
        `Catégorie changée, on est sur ${detectedCategory} maintenant !`,
      );
    } else {
      this.replyOrSend(
        user,
        chatMessage,
        ignoreCooldowns,
        `J'ai pas trouvé la catégorie ${detectedCategory}, déso Sadge`,
      );
    }
  }

  private getClassicPokemonRegex(
    firstVersionFr: RegExp,
    secondVersionFr: RegExp,
    firstVersionEn: RegExp,
    secondVersionEn: RegExp,
  ): RegExp {
    return new RegExp(
      `(?:pok[éeèê]mons?\s(?:[a-z]+\s)?(?:${firstVersionFr}|${secondVersionFr}|${firstVersionEn}|${secondVersionEn})
        | (?:${firstVersionFr}|${firstVersionEn})(?:\s(?:et|and))?\s(?:[a-z]+\s)?(?:${secondVersionFr}|${secondVersionEn}))`,
      "gi",
    );
  }
}
