import { reply, send } from "./app";

export const commandPrefix = "!";

export default class Command {
  private triggers: string[];
  private response: string;
  private replyToUser: boolean;

  private globalCooldown: number; // In miliseconds
  private userCooldown: number; // In miliseconds

  private maxUseGlobal: number; // -1 = unlimited
  private maxUsePerUser: number; // -1 = unlimited

  private userCooldowns: Map<number, number> = new Map();
  private lastUsed: number;

  private usersUseCount: Map<number, number> = new Map();
  private globalUseCount: number = 0;

  constructor(
    triggers: string[],
    response: string,
    replyToUser: boolean = true,
    globalCooldown: number = 0,
    userCooldown: number = 0,
    maxUseGlobal: number = -1,
    maxUsePerUser: number = -1
  ) {
    this.triggers = triggers;
    this.response = response;
    this.replyToUser = replyToUser;
    this.setGlobalCooldown(globalCooldown);
    this.setMaxUseGlobal(maxUseGlobal);
    this.setMaxUsePerUser(maxUsePerUser);
    this.setUserCooldown(userCooldown);
  }

  public isTriggeredBy(input: string): boolean {
    return this.triggers.includes(input.toLowerCase());
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

  public answer(userId: number = undefined, msggId: string = undefined): void {
    if (
      this.canUseGlobal() &&
      this.canUseForUser(userId) &&
      this.isGlobalCooldownFinished() &&
      this.isUserCooldownFinished(userId)
    ) {
      if (this.replyToUser && msggId !== undefined) {
        reply(this.response, msggId);
      } else {
        send(this.response);
      }

      // Update cooldowns
      this.globalUseCount += 1;
      this.lastUsed = Date.now();
      if (userId !== undefined) {
        const userUseCount = this.usersUseCount.get(userId) || 0;
        this.usersUseCount.set(userId, userUseCount + 1);
        this.userCooldowns.set(userId, this.lastUsed);
      }
    }
  }

  // Getters and setters

  public setUserCooldown(cooldownInSeconds: number): void {
    this.userCooldown = cooldownInSeconds * 1000;
  }

  public setGlobalCooldown(cooldownInSeconds: number): void {
    this.globalCooldown = cooldownInSeconds * 1000;
  }

  public setMaxUseGlobal(maxUse: number): void {
    this.maxUseGlobal = maxUse;
  }

  public setMaxUsePerUser(maxUse: number): void {
    this.maxUsePerUser = maxUse;
  }

  public canReplyToUser(): boolean {
    return this.replyToUser;
  }

  public allowReplyToUser(): void {
    this.replyToUser = true;
  }

  public preventReplyToUser(): void {
    this.replyToUser = false;
  }
}
