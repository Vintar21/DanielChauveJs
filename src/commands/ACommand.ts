import { _ } from "../utils/ImportConstants";
import ICommand from "./ICommand";

export default abstract class ACommand implements ICommand {
  protected prefix: string;

  protected triggers: Array<RegExp>;
  protected replyToUser: boolean;

  protected globalCooldown: number; // In miliseconds
  protected userCooldown: number; // In miliseconds

  protected maxUseGlobal: number; // -1 = unlimited
  protected maxUsePerUser: number; // -1 = unlimited

  protected userCooldowns: Map<number, number> = new Map();
  protected lastUsed: number = 0;

  protected usersUseCount: Map<number, number> = new Map();
  protected globalUseCount: number = 0;

  // -1 = not allowed, 0 = allowed, 1 = bypass
  protected rolesPermissions: Map<symbol, number>;
  protected usersPermissions: Map<number, number> = new Map();

  constructor(
    triggers: Set<RegExp>,
    replyToUser: boolean,
    globalCooldown: number,
    userCooldown: number,
    maxUseGlobal: number,
    maxUsePerUser: number,
    rolesPermissions: Map<symbol, number>,
    usersPermissions: Map<number, number>,
    prefix: string
  ) {
    this.triggers = Array.from(triggers);
    this.replyToUser = replyToUser;
    this.globalCooldown = globalCooldown;
    this.userCooldown = userCooldown;
    this.maxUseGlobal = maxUseGlobal;
    this.maxUsePerUser = maxUsePerUser;
    this.rolesPermissions = rolesPermissions;
    this.usersPermissions = usersPermissions;
    this.prefix = prefix;
  }

  public abstract execute(
    userId: number,
    msgId: string,
    ignoreCooldowns: boolean
  ): void;

  public match(input: string): boolean {
    return (
      _.find(this.triggers, (trigger: RegExp) => trigger.test(input)) !==
      undefined
    );
  }

  public async canExecute(
    userId: number,
    promisedRole: Promise<symbol>
  ): Promise<boolean> {
    const role = await promisedRole;
    // Specific user permissions
    if (this.usersPermissions.get(userId) === -1) {
      return false;
    } else if (this.usersPermissions.get(userId) === 1) {
      return true;
    }

    // Role permissions
    if (this.rolesPermissions.get(role) === -1) {
      return false;
    } else if (this.rolesPermissions.get(role) === 1) {
      return true;
    }

    return (
      this.canUseGlobal() &&
      this.canUseForUser(userId) &&
      this.isGlobalCooldownFinished() &&
      this.isUserCooldownFinished(userId)
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
      this.globalCooldown === 0 ||
      this.lastUsed === undefined ||
      Date.now() - this.lastUsed > this.globalCooldown
    );
  }

  // Return true if the user cooldown has finished
  private isUserCooldownFinished(userId: number): boolean {
    const lastUsed = this.userCooldowns.get(userId);
    if (this.userCooldown === 0 || lastUsed === undefined) {
      return true;
    }
    return Date.now() - lastUsed > this.userCooldown;
  }

  private canUseGlobal(): boolean {
    return this.maxUseGlobal === -1 || this.globalUseCount < this.maxUseGlobal;
  }

  private canUseForUser(userId: number): boolean {
    const userUseCount = this.usersUseCount.get(userId) || 0;
    return this.maxUsePerUser === -1 || userUseCount < this.maxUsePerUser;
  }

  public canReplyToUser(msgId: string): boolean {
    return this.replyToUser && msgId !== undefined;
  }

  public getPrefix(): string {
    return this.prefix;
  }
}
