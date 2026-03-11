import { MessageEvent } from "@twurple/easy-bot/lib";
import { MainApp } from "../../app";
import TwitchClient from "../../twitch/TwitchClient";
import {
  formatCommandMessage,
  Trigger,
  UNLIMITED,
} from "../../utils/CommandsUtils";
import { AT, SPACE } from "../../utils/StringConstants";
import { isNotAUser, User, UserId } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import ICommand from "./ICommand";

export default abstract class ACommand implements ICommand {
  protected options: CommandOptions;

  protected userCooldowns: Map<UserId, number> = new Map();
  protected lastUsed: number = 0;

  protected usersUseCount: Map<UserId, number> = new Map();
  protected globalUseCount: number = 0;

  protected randomParts: Map<string, string[]> = new Map();

  constructor(options: CommandOptions, enabled: boolean = true) {
    options.enabled = enabled;
    this.options = options;
  }

  public abstract execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void;

  protected replyOrSend(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
    message: String,
    formatMessage: boolean = false,
  ) {
    const twitchClient: TwitchClient = MainApp.getTwitchClient();
    // Automatically format message if it contains random parts
    formatMessage ||= this.randomParts.size > 0;
    message = formatMessage
      ? formatCommandMessage(message, event, this.randomParts)
      : message;
    if (this.canReplyToUser(event)) {
      twitchClient.reply(message, event);
    } else if (this.options.sendAsAnnounce) {
      TwitchClient.send(message, true);
    } else if (isNotAUser(user)) {
      TwitchClient.send(message);
    } else {
      TwitchClient.send(`${AT}${user.username} ${message}`);
    }

    if (!ignoreCooldowns) {
      this.updateCooldowns(user.userId);
    }
  }

  public reset() {
    this.globalUseCount = 0;
    this.usersUseCount.clear();
    this.userCooldowns.clear();
    this.lastUsed = undefined;
  }

  // By default we split and format the message, override this method to change this behavior
  public match(
    input: string,
    game: string,
    formatMessage: boolean = true,
  ): boolean {
    const formattedInput = formatMessage ? input.trim() : input;

    if (this.options.useFullMessage) {
      return this.internalMatch(formattedInput, this.options.getTriggers());
    }
    const parts = formattedInput.split(SPACE);

    return this.internalMatch(parts[0], this.options.getTriggers());
  }

  protected internalMatch(input: string, triggers: Array<Trigger>): boolean {
    return (
      triggers.find((trigger) => {
        if (trigger instanceof RegExp) {
          return trigger.test(input);
        } else {
          return input.startsWith(trigger);
        }
      }) !== undefined
    );
    /*_.find(triggers, (trigger: RegExp) => trigger.test(input)) !== undefined
    );*/
  }

  public async canExecute(user: User): Promise<boolean> {
    // Command enabled
    if (!this.options.enabled) {
      return false;
    }

    // Categories permissions
    const category = (
      await MainApp.getTwitchClient().getCurrentGame()
    ).toLowerCase();

    if (this.options.categoriesPermissions.isUnallowed(category)) {
      return false;
    } else if (this.options.categoriesPermissions.canBypass(category)) {
      return true;
    }

    // Specific user permissions
    if (this.options.usersPermissions.isUnallowed(user.userId)) {
      return false;
    } else if (this.options.usersPermissions.canBypass(user.userId)) {
      return true;
    }

    return user.getGreaterRole().then((role) => {
      // Role permissions
      if (this.options.rolesPermissions.isUnallowed(role)) {
        return false;
      } else if (this.options.rolesPermissions.canBypass(role)) {
        return true;
      }
      return (
        this.canUseGlobal() &&
        this.canUseForUser(user.userId) &&
        this.isGlobalCooldownFinished() &&
        this.isUserCooldownFinished(user.userId)
      );
    });
  }

  protected updateCooldowns(userId: UserId): void {
    this.globalUseCount += 1;
    this.lastUsed = Date.now();
    if (userId !== undefined) {
      const userUseCount = this.usersUseCount.get(userId) || 0;
      this.usersUseCount.set(userId, userUseCount + 1);
      this.userCooldowns.set(userId, this.lastUsed);
    }
  }

  // Return true if the global cooldown has finished
  private isGlobalCooldownFinished(): boolean {
    return (
      this.options.globalCooldown === 0 ||
      this.lastUsed === undefined ||
      Date.now() - this.lastUsed > this.options.globalCooldown
    );
  }

  // Return true if the user cooldown has finished
  private isUserCooldownFinished(userId: UserId): boolean {
    const lastUsed = this.userCooldowns.get(userId);
    if (this.options.userCooldown === 0 || lastUsed === undefined) {
      return true;
    }
    return Date.now() - lastUsed > this.options.userCooldown;
  }

  private canUseGlobal(): boolean {
    return (
      this.options.maxUseGlobal === UNLIMITED ||
      this.globalUseCount < this.options.maxUseGlobal
    );
  }

  private canUseForUser(userId: UserId): boolean {
    const userUseCount = this.usersUseCount.get(userId) || 0;
    return (
      this.options.maxUsePerUser === UNLIMITED ||
      userUseCount < this.options.maxUsePerUser
    );
  }

  public canReplyToUser(event: MessageEvent): boolean {
    return (
      this.options.replyToUser &&
      this.options.sendAsAnnounce === false &&
      event?.text !== undefined &&
      event?.text !== null &&
      event?.text.length > 0
    );
  }

  public isEnabled(): boolean {
    return this.options.enabled;
  }

  public getPrefix(): string {
    return this.options.prefix;
  }
}
