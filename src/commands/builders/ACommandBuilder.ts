import ICommand from "../ICommand";
import { DefaultCommand } from "../../utils/CommandsUtils";
import { Roles } from "../../utils/RoleUtils";
import { _ } from "../../utils/ImportConstants";
import ACommand from "../ACommand";

// Abstract builder for commands giving
export default abstract class ACommandBuilder<T extends ACommand> {
  protected triggers: Set<RegExp> = new Set();
  protected replyToUser: boolean = true;

  protected globalCooldown: number = DefaultCommand.globalCooldown; // In miliseconds
  protected userCooldown: number = DefaultCommand.userCooldown; // In miliseconds

  protected maxUseGlobal: number = DefaultCommand.maxUseGlobal; // -1 = unlimited
  protected maxUsePerUser: number = DefaultCommand.maxUsePerUser; // -1 = unlimited

  protected prefix: string = DefaultCommand.prefix;

  // -1 = not allowed, 0 = allowed, 1 = bypass
  protected rolesPermissions: Map<symbol, number> =
    DefaultCommand.rolesPermissions;

  // Permissions for specific users
  // -1 = not allowed, 0 = allowed, 1 = bypass
  protected usersPermissions: Map<number, number> =
    DefaultCommand.usersPermissions;

  // TODO: A get instance instead ?
  constructor() {}

  public abstract build(): T;

  // Getters and setters
  public addTrigger(trigger: RegExp): typeof this {
    this.triggers.add(trigger);
    return this;
  }

  public addTriggers(triggers: RegExp[]): typeof this {
    triggers.forEach((trigger) => this.addTrigger(trigger));
    return this;
  }

  public canReplyToUser(): typeof this {
    this.replyToUser = true;
    return this;
  }

  public cantReplyToUser(): typeof this {
    this.replyToUser = false;
    return this;
  }

  public setGlobalCooldown(cooldownInSeconds: number): typeof this {
    this.globalCooldown = cooldownInSeconds * 1000;
    return this;
  }

  public setUserCooldown(cooldownInSeconds: number): typeof this {
    this.userCooldown = cooldownInSeconds * 1000;
    return this;
  }

  public setMaxUseGlobal(maxUse: number): typeof this {
    this.maxUseGlobal = maxUse;
    return this;
  }

  public setMaxUsePerUser(maxUse: number): typeof this {
    this.maxUsePerUser = maxUse;
    return this;
  }

  public setCustomPrefix(prefix: string): typeof this {
    this.prefix = prefix;
    return this;
  }

  public setByPassRole(role: symbol): typeof this {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 1);
    return this;
  }

  public setAllowedRole(role: symbol): typeof this {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 0);
    return this;
  }

  public setUnallowedRole(role: symbol): typeof this {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, -1);
    return this;
  }

  public setByPassUser(userId: number): typeof this {
    this.usersPermissions.set(userId, 1);
    return this;
  }

  public setAllowedUser(userId: number): typeof this {
    this.usersPermissions.set(userId, 0);
    return this;
  }

  public setUnallowedUser(userId: number): typeof this {
    this.usersPermissions.set(userId, -1);
    return this;
  }
}
