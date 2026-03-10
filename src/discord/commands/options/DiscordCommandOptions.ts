import { Trigger } from "../../../utils/CommandsUtils";
import { seconds } from "../../../utils/CommonUtils";
import { Permissions } from "../../../utils/permissions/Permissions";
import { getDefaultRolesPermissions, Role } from "../../../utils/RoleUtils";
import { START_REGEX } from "../../../utils/StringConstants";
import { UserId } from "../../../utils/user/User";
import { getDefaultUsersPermissions } from "../../../utils/user/UserUtils";
import { DISCORD_COMMAND_PREFIX } from "../../DiscordConstants";

export default class DiscordCommandOptions {
  prefix: string = DISCORD_COMMAND_PREFIX;

  private triggers: Array<Trigger> = [];
  replyToUser: boolean = true;

  globalCooldown: number = seconds(1); // In miliseconds
  userCooldown: number = seconds(3); // In miliseconds

  authorizedChannels: number[] = [];

  useFullMessage: boolean = false;

  enabled: boolean = true;
  private usePrefix: boolean = true;

  rolesPermissions: Permissions<Role> = getDefaultRolesPermissions();
  usersPermissions: Permissions<UserId> = getDefaultUsersPermissions();

  constructor(triggers: Array<Trigger>) {
    this.triggers = triggers;
  }

  public static from(
    commandOptions: DiscordCommandOptions,
  ): DiscordCommandOptions {
    const newOptions = new DiscordCommandOptions(commandOptions.triggers);
    newOptions.prefix = commandOptions.prefix;
    newOptions.replyToUser = commandOptions.replyToUser;
    newOptions.globalCooldown = commandOptions.globalCooldown;
    newOptions.userCooldown = commandOptions.userCooldown;
    newOptions.authorizedChannels = commandOptions.authorizedChannels;
    newOptions.rolesPermissions = commandOptions.rolesPermissions;
    newOptions.usersPermissions = commandOptions.usersPermissions;
    newOptions.enabled = commandOptions.enabled;
    newOptions.usePrefix = commandOptions.usePrefix;
    newOptions.useFullMessage = commandOptions.useFullMessage;
    return newOptions;
  }

  public setPrefix(prefix: string): DiscordCommandOptions {
    this.prefix = prefix;
    return this;
  }

  public dontUsePrefix(): DiscordCommandOptions {
    this.usePrefix = false;
    return this;
  }

  // Default behavior, you probably don't need to use it
  public canUsePrefix(): DiscordCommandOptions {
    this.usePrefix = true;
    return this;
  }

  public canUseFullMessage(): DiscordCommandOptions {
    this.useFullMessage = true;
    return this;
  }

  // Default behavior, you probably don't need to use it
  public dontUseFullMessage(): DiscordCommandOptions {
    this.useFullMessage = false;
    return this;
  }

  public getTriggers(): Array<Trigger> {
    if (this.usePrefix) {
      const prefixedTriggers: Array<Trigger> = [];
      this.triggers.forEach((trigger) => {
        if (trigger instanceof RegExp) {
          prefixedTriggers.push(
            new RegExp(
              START_REGEX + this.prefix + trigger.source,
              trigger.flags,
            ),
          );
        } else {
          prefixedTriggers.push(this.prefix + trigger);
        }
      });
      return prefixedTriggers;
    }
    return this.triggers;
  }

  private addTriger(trigger: RegExp): DiscordCommandOptions {
    this.triggers.push(trigger);
    return this;
  }

  private addTriggers(triggers: Array<RegExp>): DiscordCommandOptions {
    triggers.forEach((trigger) => this.addTriger(trigger));
    return this;
  }

  public setReplyToUser(replyToUser: boolean): DiscordCommandOptions {
    this.replyToUser = replyToUser;
    return this;
  }

  public setGlobalCooldown(cooldownInSeconds: number): DiscordCommandOptions {
    this.globalCooldown = seconds(cooldownInSeconds);
    return this;
  }

  public setUserCooldown(cooldownInSeconds: number): DiscordCommandOptions {
    this.userCooldown = seconds(cooldownInSeconds);
    return this;
  }

  public setAuthorizedChannels(channelsIds: number[]): DiscordCommandOptions {
    this.authorizedChannels = channelsIds;
    return this;
  }

  public setRolesPermission(
    rolesPermissions: Permissions<Role>,
  ): DiscordCommandOptions {
    this.rolesPermissions = rolesPermissions;
    return this;
  }

  public setUsersPermissions(
    usersPermissions: Permissions<UserId>,
  ): DiscordCommandOptions {
    this.usersPermissions = usersPermissions;
    return this;
  }

  public enable(): DiscordCommandOptions {
    this.enabled = true;
    return this;
  }

  public disable(): DiscordCommandOptions {
    this.enabled = false;
    return this;
  }
}
