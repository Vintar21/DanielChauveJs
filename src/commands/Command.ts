import { reply, send } from "../app";
import { Roles } from "../utils/RoleUtils";

// TODO: Make an interface, in the future we want each command to have her own class ?
export default class Command {
  public prefix: string;

  private triggers: Set<string>;
  private response: string;
  private replyToUser: boolean;

  private globalCooldown: number; // In miliseconds
  private userCooldown: number; // In miliseconds

  private maxUseGlobal: number; // -1 = unlimited
  private maxUsePerUser: number; // -1 = unlimited

  private userCooldowns: Map<number, number> = new Map();
  private lastUsed: number = undefined;

  private usersUseCount: Map<number, number> = new Map();
  private globalUseCount: number = 0;

  // -1 = not allowed, 0 = allowed, 1 = bypass
  private rolesPermissions: Map<symbol, number>;
  private usersPermissions: Map<number, number> = new Map();

  constructor(
    triggers: Set<string>,
    response: string,
    replyToUser: boolean,
    globalCooldown: number,
    userCooldown: number,
    maxUseGlobal: number,
    maxUsePerUser: number,
    rolesPermissions: Map<symbol, number>,
    usersPermissions: Map<number, number>,
    prefix: string
  ) {
    this.triggers = triggers;
    this.response = response;
    this.replyToUser = replyToUser;
    this.globalCooldown = globalCooldown;
    this.userCooldown = userCooldown;
    this.maxUseGlobal = maxUseGlobal;
    this.maxUsePerUser = maxUsePerUser;
    this.rolesPermissions = rolesPermissions;
    this.prefix = prefix;
  }

  public execute(
    userId: number = undefined,
    msgId: string = undefined,
    ignoreCooldowns: boolean = false
  ): void {
    if (this.canReplyToUser(msgId)) {
      reply(this.response, msgId);
    } else {
      send(this.response);
    }

    if (!ignoreCooldowns) {
      this.updateCooldowns(userId);
    }
  }

  // TODO: use regex
  public match(input: string): boolean {
    return this.triggers.has(input.toLowerCase());
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

  private updateCooldowns(userId: number): void {
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
}
