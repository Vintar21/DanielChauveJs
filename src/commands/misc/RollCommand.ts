import { MessageEvent } from "@twurple/easy-bot";
import { bot } from "../../app";
import SqlManager from "../../database/SqlManager";
import ObsManager from "../../obs/ObsManager";
import User, { isNotAUser } from "../../user/User";
import { NO_MSG, choose } from "../../utils/CommandsUtils";
import {
  playSound,
  ROLLED_1000_SOUND,
  ROLLED_1_SOUND,
} from "../../utils/MediaUtils";
import { EMPTY, SPACE } from "../../utils/StringConstants";
import { undefinedUser } from "../../user/User";
import ACommand from "../ACommand";
import CommandOptions from "../CommandOptions";

// The famous
export default class RollCommand extends ACommand {
  private static RANGE_MAX: number = 1000;

  private currentMVP = { user: undefinedUser, score: 0 };

  constructor() {
    const options: CommandOptions = new CommandOptions([
      /roll/i,
    ]).setMaxUsePerUser(1);
    super(options);
    // TODO: create another command to reset MVP + reset when stream starts
    ObsManager.resetObsMvpSource();
  }

  private roll(): number {
    return Math.floor(Math.random() * (RollCommand.RANGE_MAX - 1)) + 1;
  }

  private updateMvp(user: User, value: number): void {
    // On OBS
    ObsManager.updateObsMvpSource(user.username, value);

    // Update currentMVP
    this.currentMVP = { user: user, score: value };
  }

  private async insertValue(
    userId: string,
    username: string,
    value: number,
  ): Promise<void> {
    // Check if it's a new user
    const isInserted = await SqlManager.insertNewUserQuery(userId, username);
    // Insert roll value
    await SqlManager.insertRollValueQuery(userId, value);
  }

  private static FOLLOWER_COUNT_MESSAGE: string =
    "Comme le nombre de followers ici, pourtant on aimerait tous que tu n'en fasse pas partie.";

  private async getCustomMessage(
    value: number,
    event: MessageEvent,
  ): Promise<String> {
    // Not sure if we should have direct access to bot, and not this way
    var followerCount: number = await bot.api.channels.getChannelFollowerCount(
      event.broadcasterId,
    );
    if (value === followerCount) {
      return SPACE + RollCommand.FOLLOWER_COUNT_MESSAGE;
    }

    const availableMessages: String[] =
      await SqlManager.getCustomMessagesQuery(value);

    if (availableMessages.length === 0) {
      console.log(`No custom message for ${value}`);
      return EMPTY;
    }
    console.log(`Available messages: [${availableMessages}]`);
    return SPACE + choose(availableMessages);
  }

  public async executeNoMessage(
    user: User,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    this.execute(user, NO_MSG, ignoreCooldowns);
  }

  // @Override need to be a real user
  public async canExecute(
    user: User,
    promisedRole: Promise<symbol>,
  ): Promise<boolean> {
    return !isNotAUser(user) && super.canExecute(user, promisedRole);
  }

  // TODO: MesssageUtils avec les parties de message
  public async execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    var value: number = this.roll();
    var response: string = `${user.username} lance son dé et fait... ${value} !`;
    this.insertValue(user.userId.toString(), user.username, value);
    if (value > this.currentMVP.score) {
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

    var customMessage = await this.getCustomMessage(value, event);

    switch (value) {
      case 1:
        playSound(ROLLED_1_SOUND);
        break;
      case 1000:
        playSound(ROLLED_1000_SOUND);
        break;
    }
    response += customMessage;

    super.replyOrSend(user, event, ignoreCooldowns, response);
  }
}
