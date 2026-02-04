import User from "../user/User";
import { _ } from "../utils/ImportConstants";
import ICommand from "./ICommand";
import CommandOptions from "./CommandOptions";

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
    msgId: string,
    ignoreCooldowns: boolean
  ): void;

  public match(input: string): boolean {
    return (
      _.find(this.options.triggers, (trigger: RegExp) =>
        trigger.test(input)
      ) !== undefined
    );
  }

  public async canExecute(
    user: User,
    promisedRole: Promise<symbol>
  ): Promise<boolean> {
    const role = await promisedRole;
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

  public canReplyToUser(msgId: string): boolean {
    return this.options.replyToUser && msgId !== undefined;
  }

  public getPrefix(): string {
    return this.options.prefix;
  }
}
