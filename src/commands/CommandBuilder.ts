import Command from "./Command";
import { commandPrefix } from "./CommandsConstants";

// Builder for simple commands giving a single response
export default class CommandBuilder {
  private triggers: Set<string> = new Set();
  private response: string = "";
  private replyToUser: boolean = true;

  private globalCooldown: number = 0; // In miliseconds
  private userCooldown: number = 0; // In miliseconds

  private maxUseGlobal: number = -1; // -1 = unlimited
  private maxUsePerUser: number = -1; // -1 = unlimited

  private prefix: string = commandPrefix;

  constructor() {}

  public build(): Command {
    const triggersWithPrefix: Set<string> = new Set(
      [...this.triggers].map((t) => this.prefix + t)
    );
    return new Command(
      triggersWithPrefix,
      this.response,
      this.replyToUser,
      this.globalCooldown,
      this.userCooldown,
      this.maxUseGlobal,
      this.maxUsePerUser,
      this.prefix
    );
  }

  // Getters and setters
  public addTrigger(trigger: string): CommandBuilder {
    this.triggers.add(trigger.toLowerCase());
    return this;
  }

  public addTriggers(triggers: string[]): CommandBuilder {
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
}
