import Command from "./Command";
import { commandPrefix } from "./CommandsConstants";
import { Roles } from "../utils/RoleUtils";
import { _ } from "../utils/ImportConstants";

// Builder for simple commands giving a single response
export default class CommandBuilder {
  private triggers: Set<RegExp> = new Set();
  private response: string = "";
  private replyToUser: boolean = true;

  private globalCooldown: number = 0; // In miliseconds
  private userCooldown: number = 0; // In miliseconds

  private maxUseGlobal: number = -1; // -1 = unlimited
  private maxUsePerUser: number = -1; // -1 = unlimited

  private prefix: string = commandPrefix;

  // -1 = not allowed, 0 = allowed, 1 = bypass
  private rolesPermissions: Map<symbol, number> = new Map([
    [Roles.BROADCASTER, 1],
    [Roles.MOD, 0],
    [Roles.VIP, 0],
    [Roles.SUB, 0],
    [Roles.FOLLOWER, 0],
    [Roles.NO_ROLE, 0],
  ]);

  // Permissions for specific users
  // -1 = not allowed, 0 = allowed, 1 = bypass
  private usersPermissions: Map<number, number> = new Map();

  constructor() {}

  public build(): Command {
    const res: Set<RegExp> = new Set();
    this.triggers.forEach((trigger) => {
      res.add(new RegExp(this.prefix + trigger.source, trigger.flags));
    });

    return new Command(
      res,
      this.response,
      this.replyToUser,
      this.globalCooldown,
      this.userCooldown,
      this.maxUseGlobal,
      this.maxUsePerUser,
      this.rolesPermissions,
      this.usersPermissions,
      this.prefix
    );
  }

  // Getters and setters
  public addTrigger(trigger: RegExp): CommandBuilder {
    this.triggers.add(trigger);
    return this;
  }

  public addTriggers(triggers: RegExp[]): CommandBuilder {
    triggers.forEach((trigger) => this.addTrigger(trigger));
    return this;
  }

  public setResponse(response: string): CommandBuilder {
    this.response = response;
    return this;
  }

  public canReplyToUser(): CommandBuilder {
    this.replyToUser = true;
    return this;
  }

  public cantReplyToUser(): CommandBuilder {
    this.replyToUser = false;
    return this;
  }

  public setGlobalCooldown(cooldownInSeconds: number): CommandBuilder {
    this.globalCooldown = cooldownInSeconds * 1000;
    return this;
  }

  public setUserCooldown(cooldownInSeconds: number): CommandBuilder {
    this.userCooldown = cooldownInSeconds * 1000;
    return this;
  }

  public setMaxUseGlobal(maxUse: number): CommandBuilder {
    this.maxUseGlobal = maxUse;
    return this;
  }

  public setMaxUsePerUser(maxUse: number): CommandBuilder {
    this.maxUsePerUser = maxUse;
    return this;
  }

  public setCustomPrefix(prefix: string): CommandBuilder {
    this.prefix = prefix;
    return this;
  }

  public setByPassRole(role: symbol): CommandBuilder {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 1);
    return this;
  }

  public setAllowedRole(role: symbol): CommandBuilder {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, 0);
    return this;
  }

  public setUnallowedRole(role: symbol): CommandBuilder {
    if (!Object.values(Roles).includes(role)) {
      throw new Error("Role not recognized");
    }
    this.rolesPermissions.set(role, -1);
    return this;
  }

  public setByPassUser(userId: number): CommandBuilder {
    this.usersPermissions.set(userId, 1);
    return this;
  }

  public setAllowedUser(userId: number): CommandBuilder {
    this.usersPermissions.set(userId, 0);
    return this;
  }

  public setUnallowedUser(userId: number): CommandBuilder {
    this.usersPermissions.set(userId, -1);
    return this;
  }
}
