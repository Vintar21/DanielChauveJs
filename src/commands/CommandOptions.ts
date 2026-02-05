import { commandPrefix } from "../utils/CommandsUtils";
import { Roles, Role, ALL_ROLES } from "../utils/RoleUtils";

export default class CommandOptions {
  prefix: string = commandPrefix;

  private triggers: Array<RegExp> = [];
  replyToUser: boolean = true;

  globalCooldown: number = 1000; // In miliseconds
  userCooldown: number = 3000; // In miliseconds

  maxUseGlobal: number = -1; // -1 = unlimited
  maxUsePerUser: number = -1; // -1 = unlimited

  enabled: boolean = true;
  private usePrefix: boolean = true;

  // -1 = not allowed, 0 = allowed, 1 = bypass
  rolesPermissions: Map<Role, number> = new Map([
    [Roles.BROADCASTER, 1],
    [Roles.MOD, 0],
    [Roles.VIP, 0],
    [Roles.SUB, 0],
    [Roles.FOLLOWER, 0],
    [Roles.NO_ROLE, 0],
  ]);
  usersPermissions: Map<number, number> = new Map();

  constructor(triggers: Array<RegExp>) {
    this.triggers = triggers;
  }

  public static from(commandOptions: CommandOptions): CommandOptions {
    const newOptions = new CommandOptions(commandOptions.triggers);
    newOptions.prefix = commandOptions.prefix;
    newOptions.replyToUser = commandOptions.replyToUser;
    newOptions.globalCooldown = commandOptions.globalCooldown;
    newOptions.userCooldown = commandOptions.userCooldown;
    newOptions.maxUseGlobal = commandOptions.maxUseGlobal;
    newOptions.maxUsePerUser = commandOptions.maxUsePerUser;
    newOptions.rolesPermissions = commandOptions.rolesPermissions;
    newOptions.usersPermissions = commandOptions.usersPermissions;
    newOptions.enabled = commandOptions.enabled;
    newOptions.usePrefix = commandOptions.usePrefix;
    return newOptions;
  }

  public setPrefix(prefix: string): CommandOptions {
    this.prefix = prefix;
    return this;
  }

  public dontUsePrefix(): CommandOptions {
    this.usePrefix = false;
    return this;
  }

  // Default behavior, you probably don't need to use it
  public canUsePrefix(): CommandOptions {
    this.usePrefix = true;
    return this;
  }

  public getTriggers(): Array<RegExp> {
    if (this.usePrefix) {
      const prefixedTriggers: Array<RegExp> = [];
      this.triggers.forEach((trigger) => {
        prefixedTriggers.push(
          new RegExp(this.prefix + trigger.source, trigger.flags),
        );
      });
      return prefixedTriggers;
    }
    return this.triggers;
  }

  private addTriger(trigger: RegExp): CommandOptions {
    this.triggers.push(trigger);
    return this;
  }

  private addTriggers(triggers: Array<RegExp>): CommandOptions {
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

  public setByPassRole(role: Role): CommandOptions {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 1);
    return this;
  }

  public setByPassRoles(roles: Role[]): CommandOptions {
    roles.forEach((role) => this.setByPassRole(role));
    return this;
  }

  // All roles can bypass limitations except the given ones
  public byPassAllRolesExcept(roles: Role[]): CommandOptions {
    const rolesToByPass: Role[] = ALL_ROLES.filter(
      (role) => !roles.includes(role),
    );
    this.setByPassRoles(rolesToByPass);
    return this;
  }

  public setAllowedRole(role: Role): CommandOptions {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 0);
    return this;
  }

  public setAllowedRoles(roles: Role[]): CommandOptions {
    roles.forEach((role) => this.setAllowedRole(role));
    return this;
  }

  // Shouldn't use it, by default all roles are allowed, use unallowRoles
  public allowAllRolesExcept(roles: Role[]): CommandOptions {
    const rolesToAllow: Role[] = ALL_ROLES.filter(
      (role) => !roles.includes(role),
    );
    this.setAllowedRoles(rolesToAllow);
    return this;
  }

  public setUnallowedRole(role: Role): CommandOptions {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, -1);
    return this;
  }

  public setUnallowedRoles(roles: Role[]): CommandOptions {
    roles.forEach((role) => this.setUnallowedRole(role));
    return this;
  }

  public unallowAllRolesExcept(roles: Role[]): CommandOptions {
    const rolesToUnallow: Role[] = ALL_ROLES.filter(
      (role) => !roles.includes(role),
    );
    this.setUnallowedRoles(rolesToUnallow);
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

  public enable(): CommandOptions {
    this.enabled = true;
    return this;
  }

  public disable(): CommandOptions {
    this.enabled = false;
    return this;
  }
}
