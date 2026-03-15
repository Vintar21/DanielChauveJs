import { MainApp } from "../../../app";
import TwitchClient from "../../../twitch/TwitchClient";
import { Trigger } from "../../../utils/CommandsUtils";
import { isString } from "../../../utils/CommonUtils";
import { SPACE } from "../../../utils/StringConstants";
import { User, UserId } from "../../../utils/user/User";
import { DiscordMessage } from "../../DiscordConstants";
import DiscordCommandOptions from "../options/DiscordCommandOptions";

export default abstract class ADiscordCommand {
  protected name;

  protected options: DiscordCommandOptions;

  protected userCooldowns: Map<UserId, number> = new Map();
  protected lastUsed: number = 0;

  protected usersUseCount: Map<UserId, number> = new Map();
  protected globalUseCount: number = 0;

  constructor(
    name: string,
    options: DiscordCommandOptions,
    enabled: boolean = true,
  ) {
    options.enabled = enabled;
    this.options = options;
    this.name = this.options.usePrefix ? this.options.prefix + name : name;
  }

  public abstract execute(
    message: DiscordMessage,
    user: User,
    ignoreCooldowns: boolean,
  ): Promise<void>;

  protected getArgs(message: DiscordMessage): string[] {
    const parts = message.content.trim().split(SPACE);
    if (parts.length > 0) {
      return parts.slice(1);
    }
    return [];
  }

  protected replyOrSend(
    message: DiscordMessage,
    response: string,
    user: User,
    ignoreCooldowns: boolean,
  ) {
    const twitchClient: TwitchClient = MainApp.getTwitchClient();

    if (this.canReplyToUser(message)) {
      message.reply(response);
    } else {
      message.channel.send(response);
    }

    if (!ignoreCooldowns) {
      this.updateCooldowns(user.userId);
    }
  }

  protected async replyOrSendWithFile(
    message: DiscordMessage,
    response: string,
    filePath: string,
    user: User,
    ignoreCooldowns: boolean,
  ): Promise<void> {
    const twitchClient: TwitchClient = MainApp.getTwitchClient();
    const responseWithFile = { content: response, files: [filePath] };

    if (this.canReplyToUser(message)) {
      await message.reply(responseWithFile);
    } else {
      await message.channel.send(responseWithFile);
    }

    if (!ignoreCooldowns) {
      this.updateCooldowns(user.userId);
    }
  }

  public reset() {
    this.globalUseCount = 0;
    this.usersUseCount.clear();
    this.userCooldowns.clear();
    this.lastUsed = 0;
  }

  // By default we split and format the message, override this method to change this behavior
  public match(input: string, formatMessage: boolean = true): boolean {
    const formattedInput = formatMessage ? input.trim() : input;

    if (this.options.useFullMessage) {
      return this.internalMatch(formattedInput, this.options.getTriggers());
    }
    const parts = formattedInput.split(SPACE);

    return this.internalMatch(parts[0], this.options.getTriggers());
  }

  protected internalMatch(input: string, triggers: Array<Trigger>): boolean {
    return (
      triggers.find((trigger) => {
        if (trigger instanceof RegExp) {
          return trigger.test(input);
        } else {
          return input.startsWith(trigger);
        }
      }) !== undefined
    );
    /*_.find(triggers, (trigger: RegExp) => trigger.test(input)) !== undefined
    );*/
  }

  public async canExecute(
    user: User,
    message: DiscordMessage,
  ): Promise<boolean> {
    // Command enabled
    if (!this.options.enabled) {
      return false;
    }

    // Specific user permissions
    if (this.options.usersPermissions.isUnallowed(user.userId)) {
      return false;
    } else if (this.options.usersPermissions.canBypass(user.userId)) {
      return true;
    }

    // Server permissions
    if (this.options.serverPermissions.isUnallowed(message.guildId)) {
      return false;
    } else if (this.options.serverPermissions.canBypass(message.guildId)) {
      return true;
    }

    // Channel permissions
    if (this.options.channelPermissions.isUnallowed(message.channelId)) {
      return false;
    } else if (this.options.channelPermissions.canBypass(message.channelId)) {
      return true;
    }

    return user.getGreaterRole().then((role) => {
      // Role permissions
      if (this.options.rolesPermissions.isUnallowed(role)) {
        return false;
      } else if (this.options.rolesPermissions.canBypass(role)) {
        return true;
      }

      return (
        this.isGlobalCooldownFinished() &&
        this.isUserCooldownFinished(user.userId)
      );
    });
  }

  protected updateCooldowns(userId: UserId): void {
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
  private isUserCooldownFinished(userId: UserId): boolean {
    const lastUsed = this.userCooldowns.get(userId);
    if (this.options.userCooldown === 0 || lastUsed === undefined) {
      return true;
    }
    return Date.now() - lastUsed > this.options.userCooldown;
  }

  public canReplyToUser(message: DiscordMessage): boolean {
    return (
      this.options.replyToUser &&
      message?.content !== undefined &&
      message?.content !== null &&
      message?.content.length > 0
    );
  }

  public getName(): string {
    return this.name;
  }

  public getTriggers(): Trigger[] {
    return [this.name, ...this.options.getTriggers()];
  }

  public getAllStringTriggers(): string[] {
    const stringTriggers: string[] = [];
    this.getTriggers()
      .filter((trigger) => isString(trigger))
      .forEach((stringTrigger) =>
        stringTriggers.push(stringTrigger.toString()),
      );
    return stringTriggers;
  }

  public isEnabled(): boolean {
    return this.options.enabled;
  }

  public getPrefix(): string {
    return this.options.prefix;
  }
}
