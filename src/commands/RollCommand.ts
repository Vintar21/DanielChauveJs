import { MessageEvent } from "@twurple/easy-bot/lib";
import { reply, send } from "../app";
import SqlManager from "../database/SqlManager";
import ObsManager from "../obs/ObsManager";
import User from "../user/User";
import { addPrefixToTriggers, NO_MSG } from "../utils/CommandsUtils";
import { EMPTY, SPACE } from "../utils/StringConstants";
import ACommand from "./ACommand";
import CommandOptions from "./CommandOptions";

// The famous
export default class RollCommand extends ACommand {
  private static RANGE_MAX: number = 1000;

  private currentMVP = { user: undefined, score: 0 };

  private static instance: RollCommand = new RollCommand();

  constructor() {
    const options: CommandOptions = new CommandOptions().setMaxUsePerUser(1);
    options.triggers = addPrefixToTriggers([/roll/i], options.prefix);
    super(options);
    // TODO: create another command to reset MVP + reset when stream starts
    ObsManager.resetObsMvpSource();
  }

  public static getInstance(): RollCommand {
    return RollCommand.instance;
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

  private async getCustomMessage(value: number): Promise<String> {
    const availableMessages: String[] =
      await SqlManager.getCustomMessagesQuery(value);

    if (availableMessages.length === 0) {
      console.log(`No custom message for ${value}`);
      return EMPTY;
    }
    console.log("Available messages: " + availableMessages);
    const ind: number = Math.floor(Math.random() * availableMessages.length);
    return SPACE + availableMessages[ind];
  }

  public async executeNoMessage(
    user: User,
    ignoreCooldowns: boolean = false,
  ): Promise<void> {
    this.execute(user, NO_MSG, ignoreCooldowns);
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
      if (this.currentMVP.user === undefined) {
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

    const customMessage = await this.getCustomMessage(value);
    response += customMessage;

    if (super.canReplyToUser(event)) {
      reply(response, event);
    } else {
      send(response);
    }

    if (!ignoreCooldowns) {
      super.updateCooldowns(user.userId);
    }
  }
}
