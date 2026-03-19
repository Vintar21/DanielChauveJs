import { ChatMessage } from "@twurple/chat";
import { MainApp } from "../../app";
import SqlManager from "../../database/SqlManager";
import { FOLLOWER_COUNT_MESSAGE, NO_MSG } from "../../utils/CommandsUtils";
import { choose, log } from "../../utils/CommonUtils";
import {
  playSound,
  ROLLED_1000_SOUND,
  ROLLED_1_SOUND,
} from "../../utils/MediaUtils";
import { Roles } from "../../utils/RoleUtils";
import { AT, EMPTY, SPACE } from "../../utils/StringConstants";
import { isNotAUser, undefinedUser, User, UserId } from "../../utils/user/User";
import { resetMvpCommand } from "../AllCommands";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";

const mainTrigger: string = "roll";

const options: CommandOptions = new CommandOptions([])
  //.setMaxUsePerUser(1)
  .setUserCooldown(15);

const BONUS_ARG: string = "bonus";
const MALUS_ARG: string = "malus";
const RESET_ARG: string = "reset";
const STATS_ARG: RegExp = /(stat(istique)?s?|moyennes?|means?|av(era)?ge?s?)/i;

class Mvp {
  public user: User = undefinedUser;
  public score: number = 0;

  constructor(user: User, score: number) {
    this.user = user;
    this.score = score;
  }
}

/* Roll a number between 1 and 1000, store the role in database and update the OBS layout with the greatest number rolled
 * Reply with a custom message for each value if there is one
 */
export default class RollCommand extends AArgumentsCommand {
  private static RANGE_MAX: number = 1000;
  private static ROLL_MAX_USE_PER_USER: number = 1;

  private currentMVP: Mvp = new Mvp(undefinedUser, undefined);

  private userModifiers: Map<UserId, number> = new Map();

  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  private roll(): number {
    return Math.floor(Math.random() * (RollCommand.RANGE_MAX - 1)) + 1;
  }

  private updateMvp(user: User, value: number): void {
    // On OBS
    MainApp.getObsManager().updateObsMvpSource(user.username, value);

    // Update currentMVP
    this.currentMVP = new Mvp(user, value);
  }

  public reset() {
    log("Reset MVP !");
    super.reset();
    this.currentMVP = new Mvp(undefinedUser, 0);
    this.userModifiers.clear();
    MainApp.getObsManager().resetObsMvpSource();
  }

  private async insertValue(
    userId: UserId,
    username: string,
    value: number,
  ): Promise<void> {
    // Check if it's a new user
    const isInserted = await SqlManager.insertNewUserQuery(userId, username);
    // Insert roll value
    await SqlManager.insertRollValueQuery(userId, value);
  }

  private async getCustomMessage(value: number, user: User): Promise<String> {
    // Not sure if we should have direct access to bot, and not this way
    const twitchClient = MainApp.getTwitchClient();
    var followerCount: number = await twitchClient
      .getChannelsApi()
      .getChannelFollowerCount(twitchClient.getBroadcasterId());
    if (value === followerCount) {
      return SPACE + FOLLOWER_COUNT_MESSAGE;
    }

    const availableMessages: String[] =
      await SqlManager.getCustomMessagesQuery(value);

    if (availableMessages.length === 0) {
      log(`No custom message for ${value}`);
      var averageMessage;
      const average = await SqlManager.averageRollForUserId(user.userId);

      // Out of range values that can be reached thanks to modifiers
      if (value === 0) {
        return SPACE + "Zéro pointé, ça te va bien tiens.";
      } else if (value < 0) {
        return (
          SPACE +
          "Mdrr t'as réussi à faire un score négatif, c'est dire ton level."
        );
      } else if (value > RollCommand.RANGE_MAX) {
        return SPACE + "Hey ! Mais c'est de la triche !";
      }

      if (average) {
        if (value > average) {
          averageMessage = "Bon bah au moins c'est mieux que d'habitude...";
        } else if (value === average) {
          averageMessage =
            "Pile ta moyenne, c'est fou à quel point tu fais aucun effort.";
        } else {
          averageMessage =
            "J'en attendais pas grand chose de toi et pourtant tu réussis à faire moins bien que d'habitude...";
        }
        return SPACE + averageMessage;
      }
      return "Même pour un premier roll c'est décevant...";
    }
    log(`Available messages: [${availableMessages}]`);
    return SPACE + choose(availableMessages);
  }

  public async executeNoMessage(
    user: User,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    this.executeNoArg(user, NO_MSG, ignoreCooldowns);
  }

  // @Override need to be a real user
  public async canExecute(user: User): Promise<boolean> {
    return !isNotAUser(user) && super.canExecute(user);
  }

  protected async executeNoArg(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ): Promise<void> {
    const twitchClient = MainApp.getTwitchClient();
    const userUseCount = this.usersUseCount.get(user.userId) || 0;
    // Manually limit to 1 roll per user
    if (
      user.userId !== Number(twitchClient.getBroadcasterId()) &&
      !ignoreCooldowns &&
      userUseCount >= RollCommand.ROLL_MAX_USE_PER_USER
    ) {
      return;
    }

    var value: number = this.roll();
    var response: string = `${user.username} lance son dé et fait... ${value} !`;

    if (this.userHasModifier(user.userId)) {
      const rawValue = value;
      const modifier = this.userModifiers.get(user.userId);
      value += modifier;
      response = `${user.username} lance son dé et fait... ${value} (${rawValue} ${modifier < 0 ? modifier : `+ ${modifier}`}) !`;
    }
    this.insertValue(user.userId, user.username, value);
    if (!this.currentMVP.score || value > this.currentMVP.score) {
      if (isNotAUser(this.currentMVP.user)) {
        // No current MVP
        response += ` Et iel devient notre premièr·e MVP du stream !!!`;
      } else if (user.userId === this.currentMVP.user.userId) {
        // MVP is the same user
        response += ` Et iel confirme son statut de MVP !!!`;
      } else {
        // MVP is another user
        response += ` Et iel devient le·a nouvel·le MVP en humiliant @${this.currentMVP.user.username}!!!`;
      }
      this.updateMvp(user, value);
    } else if (value === this.currentMVP.score) {
      if (user.userId === this.currentMVP.user.userId) {
        // MVP is the same user
        response += ` Et iel refait le même lancer pour confirmer son statut de MVP !!!`;
      } else {
        // MVP is another user
        response += ` Et iel vole le MVP en égalisant @${this.currentMVP.user.username}!!!`;
      }

      //TODO: nombre de follower
      this.updateMvp(user, value);
    }

    var customMessage = await this.getCustomMessage(value, user);

    switch (value) {
      case 1:
        playSound(ROLLED_1_SOUND);
        break;
      case 1000:
        playSound(ROLLED_1000_SOUND);
        break;
    }
    response += customMessage;

    // Ignore cooldown so the user can use !roll stat just after
    super.replyOrSend(user, chatMessage, true, response);

    // Manually update cooldowns
    this.globalUseCount += 1;
    this.lastUsed = Date.now();
    if (user.userId !== undefined) {
      const userUseCount = this.usersUseCount.get(user.userId) || 0;
      this.usersUseCount.set(user.userId, userUseCount + 1);
      //this.userCooldowns.set(user.userId, this.lastUsed);
    }
    return;
  }

  // TODO: MesssageUtils avec les parties de message
  protected async executeWithArgs(
    user: User,
    chatMessage: ChatMessage,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void> {
    if (args.length === 0) {
      return this.executeNoArg(user, chatMessage, ignoreCooldowns);
    } else {
      const twitchClient = MainApp.getTwitchClient();

      // TODO: switch case
      if (args[0] === RESET_ARG) {
        if (user.role >= Roles.MOD) {
          return resetMvpCommand.execute(user, chatMessage, true);
        } else {
          this.replyOrSend(
            user,
            chatMessage,
            ignoreCooldowns,
            "Mdrr tu te prends pour qui à vouloir reset le MVP ? T'as pas les droits nullos.",
          );
        }
      } else if (
        user.role >= Roles.MOD &&
        (args[0] === BONUS_ARG || args[0] === MALUS_ARG)
      ) {
        if (args.length === 1) {
          this.replyOrSend(
            user,
            chatMessage,
            ignoreCooldowns,
            "Va falloir me donner un bonus valide le sang",
          );
          return;
        } else if (args.length === 2) {
          const modifier =
            args[0] === BONUS_ARG ? Number(args[1]) : Number("-" + args[1]);
          this.addModifier(user.userId, Number(args[1]));
          this.replyOrSend(
            user,
            chatMessage,
            ignoreCooldowns,
            `Je t'ai ajouté ${modifier} en bonus, tu as maintenant un bonus total de ${this.userModifiers.get(user.userId)} !`,
          );
        } else if (args.length >= 3) {
          const userIdRaw = await twitchClient
            .getUsersApi()
            .getUserByName(args[1].toString());
          const userId =
            !userIdRaw || userIdRaw === null ? undefined : Number(userIdRaw.id);
          const modifier =
            args[0] === BONUS_ARG ? Number(args[2]) : Number("-" + args[2]);
          log(modifier);
          if (!isNaN(modifier) && !isNaN(userId)) {
            this.addModifier(userId, modifier);
            this.replyOrSend(
              user,
              chatMessage,
              ignoreCooldowns,
              `J'ai ajouté ${modifier} en bonus à ${args[1]}, il a maintenant un bonus total de ${this.userModifiers.get(userId)} !`,
            );
          }
        }
      } else if (STATS_ARG.test(args[0].toString())) {
        if (args.length > 1) {
          const givenUser = args[1].toString().replaceAll(AT, EMPTY);
          log(`-${givenUser}-`);
          const validUsername: boolean = /^[a-z0-9_]{3,}$/gi.test(givenUser);
          log(validUsername);
          const possibleUser = validUsername
            ? await twitchClient
                .getUsersApi()
                .getUserByName(args[1].toString().replaceAll(AT, EMPTY))
            : undefined;
          if (!possibleUser || possibleUser === null) {
            this.replyOrSend(
              user,
              chatMessage,
              ignoreCooldowns,
              "Je sais pas de qui tu parles, fais un effort.",
            );
          } else {
            const average = await SqlManager.averageRollForUserId(
              Number(possibleUser.id),
            );
            if (!average) {
              this.replyOrSend(
                user,
                chatMessage,
                ignoreCooldowns,
                `Y a pas de stats pour ${possibleUser.name}, la honte LUL`,
              );
            } else {
              this.replyOrSend(
                user,
                chatMessage,
                ignoreCooldowns,
                `${possibleUser.name} a une moyenne de ${average}... Comme on dit, c'est pas la moyenne qui compte mais la façon de !roll...`,
              );
            }
          }
        } else {
          const average = await SqlManager.averageRollForUserId(user.userId);
          if (!average) {
            this.replyOrSend(
              user,
              chatMessage,
              ignoreCooldowns,
              `T'as pas de stats BG (pas le dé qui roule le plus loin vot' pote)`,
            );
          } else {
            this.replyOrSend(
              user,
              chatMessage,
              ignoreCooldowns,
              `T'as une moyenne de ${average}... Comme on dit, c'est pas la moyenne qui compte mais ta façon de !roll...`,
            );
          }
        }
      }
    }
    return;
  }

  public getCurrentMvp(): Mvp {
    return this.currentMVP;
  }

  public userHasModifier(userId: UserId): boolean {
    return this.userModifiers.get(userId) !== undefined;
  }

  // Return the current modifier
  public addModifier(userId: UserId, modifier: number): number {
    // TODO: if user has already rolled, update the values
    log(`Adding modifier for ${userId}: ${modifier}`);
    if (this.userHasModifier(userId)) {
      const currentModifier = this.userModifiers.get(userId);
      modifier += currentModifier;
      log(`Modifier updated: ${currentModifier} => ${modifier}`);
    }
    this.userModifiers.set(userId, modifier);
    return modifier;
  }

  public clearModifier(userId: UserId): void {
    this.userModifiers.set(userId, 0);
    log(`Roll modifiers clear for ${userId}`);
  }
}
