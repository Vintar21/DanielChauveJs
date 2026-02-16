import { MessageEvent } from "@twurple/easy-bot/lib";
import { reply, send } from "../app";
import User, { isNotAUser, UserId } from "../user/User";
import { BYPASS, Right, UNALLOWED } from "../utils/CommonUtils";
import { _ } from "../utils/ImportConstants";
import { Role } from "../utils/RoleUtils";
import { SPACE } from "../utils/StringConstants";
import CommandOptions from "./CommandOptions";
import ICommand from "./ICommand";
import { UNLIMITED } from "./CommandsUtils";

export default abstract class ACommand implements ICommand {
  protected options: CommandOptions;

  protected userCooldowns: Map<UserId, number> = new Map();
  protected lastUsed: number = 0;

  protected usersUseCount: Map<UserId, number> = new Map();
  protected globalUseCount: number = 0;

  protected rolesPermissions: Map<Role, Right>;
  protected usersPermissions: Map<UserId, Right> = new Map();

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
  ) {
    if (this.canReplyToUser(event)) {
      reply(message, event);
    } else if (isNotAUser(user)) {
      send(message);
    } else {
      send(`@${user.username} ${message}`);
    }

    if (!ignoreCooldowns) {
      this.updateCooldowns(user.userId);
    }
  }

  // By default we split and format the message, override this method to change this behavior
  public match(input: string, formatMessage: boolean = true): boolean {
    const formattedInput = formatMessage ? input.toLowerCase().trim() : input;

    if (this.options.useFullMessage) {
      return this.internalMatch(formattedInput, this.options.getTriggers());
    }
    const parts = formattedInput.split(SPACE);

    return this.internalMatch(parts[0], this.options.getTriggers());
  }

  protected internalMatch(input: string, triggers: Array<RegExp>): boolean {
    return (
      _.find(triggers, (trigger: RegExp) => trigger.test(input)) !== undefined
    );
  }

  public async canExecute(
    user: User,
    promisedRole: Promise<Role>,
  ): Promise<boolean> {
    const role = await promisedRole;

    // Command enabled
    if (!this.options.enabled) {
      return false;
    }

    // Specific user permissions
    if (this.options.usersPermissions.get(user.userId) === UNALLOWED) {
      return false;
    } else if (this.options.usersPermissions.get(user.userId) === BYPASS) {
      return true;
    }

    // Role permissions
    if (this.options.rolesPermissions.get(role) === UNALLOWED) {
      return false;
    } else if (this.options.rolesPermissions.get(role) === BYPASS) {
      return true;
    }

    return (
      this.canUseGlobal() &&
      this.canUseForUser(user.userId) &&
      this.isGlobalCooldownFinished() &&
      this.isUserCooldownFinished(user.userId)
    );
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
