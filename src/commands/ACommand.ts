import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../user/User";
import { _ } from "../utils/ImportConstants";
import CommandOptions from "./CommandOptions";
import ICommand from "./ICommand";
import { SPACE } from "../utils/StringConstants";
import { send, reply } from "../app";

export default abstract class ACommand implements ICommand {
  protected options: CommandOptions;

  protected userCooldowns: Map<number, number> = new Map();
  protected lastUsed: number = 0;

  protected usersUseCount: Map<number, number> = new Map();
  protected globalUseCount: number = 0;

  // -1 = not allowed, 0 = allowed, 1 = bypass
  protected rolesPermissions: Map<symbol, number>;
  protected usersPermissions: Map<number, number> = new Map();

  constructor(options: CommandOptions) {
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
    } else {
      send(`@${user.username} ${message}`);
    }

    if (!ignoreCooldowns) {
      this.updateCooldowns(user.userId);
    }
  }

  // By default we split the message, override this method to change this behavior
  public match(input: string): boolean {
    const parts = input.toLowerCase().trim().split(SPACE);

    return this.internalMatch(parts[0], this.options.getTriggers());
  }

  protected internalMatch(input: string, triggers: Array<RegExp>): boolean {
    return (
      _.find(triggers, (trigger: RegExp) => trigger.test(input)) !== undefined
    );
  }

  public async canExecute(
    user: User,
    promisedRole: Promise<symbol>,
  ): Promise<boolean> {
    const role = await promisedRole;

    // Command enabled
    if (!this.options.enabled) {
      return false;
    }

    // Specific user permissions
    if (this.options.usersPermissions.get(user.userId) === -1) {
      return false;
    } else if (this.options.usersPermissions.get(user.userId) === 1) {
      return true;
    }

    // Role permissions
    if (this.options.rolesPermissions.get(role) === -1) {
      return false;
    } else if (this.options.rolesPermissions.get(role) === 1) {
      return true;
    }

    return (
      this.canUseGlobal() &&
      this.canUseForUser(user.userId) &&
      this.isGlobalCooldownFinished() &&
      this.isUserCooldownFinished(user.userId)
    );
  }

  protected updateCooldowns(userId: number): void {
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
  private isUserCooldownFinished(userId: number): boolean {
    const lastUsed = this.userCooldowns.get(userId);
    if (this.options.userCooldown === 0 || lastUsed === undefined) {
      return true;
    }
    return Date.now() - lastUsed > this.options.userCooldown;
  }

  private canUseGlobal(): boolean {
    return (
      this.options.maxUseGlobal === -1 ||
      this.globalUseCount < this.options.maxUseGlobal
    );
  }

  private canUseForUser(userId: number): boolean {
    const userUseCount = this.usersUseCount.get(userId) || 0;
    return (
      this.options.maxUsePerUser === -1 ||
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

  public getPrefix(): string {
    return this.options.prefix;
  }
}
