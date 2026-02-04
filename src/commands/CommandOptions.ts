import { Roles } from "../utils/RoleUtils";
import { commandPrefix } from "../utils/CommandsUtils";

export default class CommandOptions {
  prefix: string = commandPrefix;

  triggers: Array<RegExp> = [];
  replyToUser: boolean = true;

  globalCooldown: number = 0; // In miliseconds
  userCooldown: number = 0; // In miliseconds

  maxUseGlobal: number = -1; // -1 = unlimited
  maxUsePerUser: number = -1; // -1 = unlimited

  // -1 = not allowed, 0 = allowed, 1 = bypass
  rolesPermissions: Map<symbol, number> = new Map([
    [Roles.BROADCASTER, 1],
    [Roles.MOD, 0],
    [Roles.VIP, 0],
    [Roles.SUB, 0],
    [Roles.FOLLOWER, 0],
    [Roles.NO_ROLE, 0],
  ]);
  usersPermissions: Map<number, number> = new Map();

  constructor() {}

  public static from(commandOptions: CommandOptions): CommandOptions {
    const newOptions = new CommandOptions();
    newOptions.prefix = commandOptions.prefix;
    newOptions.addTriggers(commandOptions.triggers);
    newOptions.replyToUser = commandOptions.replyToUser;
    newOptions.globalCooldown = commandOptions.globalCooldown;
    newOptions.userCooldown = commandOptions.userCooldown;
    newOptions.maxUseGlobal = commandOptions.maxUseGlobal;
    newOptions.maxUsePerUser = commandOptions.maxUsePerUser;
    newOptions.rolesPermissions = commandOptions.rolesPermissions;
    newOptions.usersPermissions = commandOptions.usersPermissions;
    return newOptions;
  }

  public setPrefix(prefix: string): CommandOptions {
    this.prefix = prefix;
    return this;
  }

  public addTriger(trigger: RegExp): CommandOptions {
    this.triggers.push(trigger);
    return this;
  }

  public addTriggers(triggers: Array<RegExp>): CommandOptions {
    triggers.forEach((trigger) => this.addTriger(trigger));
    return this;
  }

  public setReplyToUser(replyToUser: boolean): CommandOptions {
    this.replyToUser = replyToUser;
    return this;
  }

  public setGlobalCooldown(cooldownInSeconds: number): CommandOptions {
    this.globalCooldown = cooldownInSeconds * 1000;
    return this;
  }

  public setUserCooldown(cooldownInSeconds: number): CommandOptions {
    this.userCooldown = cooldownInSeconds * 1000;
    return this;
  }

  public setMaxUseGlobal(maxUse: number): CommandOptions {
    this.maxUseGlobal = maxUse;
    return this;
  }

  public setMaxUsePerUser(maxUse: number): CommandOptions {
    this.maxUsePerUser = maxUse;
    return this;
  }

  public setByPassRole(role: symbol): CommandOptions {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 1);
    return this;
  }

  public setAllowedRole(role: symbol): CommandOptions {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 0);
    return this;
  }

  public setUnallowedRole(role: symbol): CommandOptions {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, -1);
    return this;
  }

  public setByPassUser(userId: number): CommandOptions {
    this.usersPermissions.set(userId, 1);
    return this;
  }

  public setAllowedUser(userId: number): CommandOptions {
    this.usersPermissions.set(userId, 0);
    return this;
  }

  public setUnallowedUser(userId: number): CommandOptions {
    this.usersPermissions.set(userId, -1);
    return this;
  }
}
