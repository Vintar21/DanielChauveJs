import { UserId } from "../../utils/user/User";
import { getDefaultUsersPermissions } from "../../utils/user/UserUtils";
import { seconds, warn } from "../../utils/CommonUtils";
import { Permissions } from "../../utils/permissions/Permissions";
import { getDefaultRolesPermissions, Role } from "../../utils/RoleUtils";
import {
  COMMAND_PREFIX,
  Trigger,
  TWITCH_UNAUTHORIZED_PREFIXES,
  UNLIMITED,
  UseCount,
} from "../../utils/CommandsUtils";
import { START_REGEX } from "../../utils/StringConstants";
import {
  Category,
  getDefaultCategoriesPermissions,
} from "../../utils/CategoriesConstants";

export default class CommandOptions {
  prefix: string = COMMAND_PREFIX;

  private triggers: Array<Trigger> = [];
  replyToUser: boolean = true;
  sendAsAnnounce: boolean = false;

  globalCooldown: number = seconds(1); // In miliseconds
  userCooldown: number = seconds(3); // In miliseconds

  maxUseGlobal: UseCount = UNLIMITED;
  maxUsePerUser: UseCount = UNLIMITED;

  useFullMessage: boolean = false;

  enabled: boolean = true;
  private usePrefix: boolean = true;

  // Has variable to replace in the answer
  formatMessage: boolean = false;

  rolesPermissions: Permissions<Role> = getDefaultRolesPermissions();
  usersPermissions: Permissions<UserId> = getDefaultUsersPermissions();
  categoriesPermissions: Permissions<Category> =
    getDefaultCategoriesPermissions();

  constructor(triggers: Array<Trigger>) {
    this.triggers = triggers;
  }

  public static from(commandOptions: CommandOptions): CommandOptions {
    const newOptions = new CommandOptions(commandOptions.triggers);
    newOptions.prefix = commandOptions.prefix;
    newOptions.replyToUser = commandOptions.replyToUser;
    newOptions.sendAsAnnounce = commandOptions.sendAsAnnounce;
    newOptions.globalCooldown = commandOptions.globalCooldown;
    newOptions.userCooldown = commandOptions.userCooldown;
    newOptions.maxUseGlobal = commandOptions.maxUseGlobal;
    newOptions.maxUsePerUser = commandOptions.maxUsePerUser;
    newOptions.rolesPermissions = commandOptions.rolesPermissions;
    newOptions.usersPermissions = commandOptions.usersPermissions;
    newOptions.categoriesPermissions = commandOptions.categoriesPermissions;
    newOptions.enabled = commandOptions.enabled;
    newOptions.usePrefix = commandOptions.usePrefix;
    newOptions.useFullMessage = commandOptions.useFullMessage;
    newOptions.formatMessage = commandOptions.formatMessage;
    return newOptions;
  }

  public setPrefix(prefix: string): CommandOptions {
    if (TWITCH_UNAUTHORIZED_PREFIXES.includes(prefix)) {
      warn(
        `Can't use "${prefix}" as prefix for twitch commands. The prefix is still "${this.prefix}"`,
      );
      return this;
    }
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

  public canUseFullMessage(): CommandOptions {
    this.useFullMessage = true;
    return this;
  }

  // Default behavior, you probably don't need to use it
  public dontUseFullMessage(): CommandOptions {
    this.useFullMessage = false;
    return this;
  }

  public hasPlaceholders(): CommandOptions {
    this.formatMessage = true;
    return this;
  }

  // Default behavior, you prbably don't need to use it
  public noPlaceholder(): CommandOptions {
    this.formatMessage = true;
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

  public sendAnnounce(): CommandOptions {
    this.sendAsAnnounce = true;
    return this;
  }

  public setGlobalCooldown(cooldownInSeconds: number): CommandOptions {
    this.globalCooldown = seconds(cooldownInSeconds);
    return this;
  }

  public setUserCooldown(cooldownInSeconds: number): CommandOptions {
    this.userCooldown = seconds(cooldownInSeconds);
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

  public setRolesPermission(
    rolesPermissions: Permissions<Role>,
  ): CommandOptions {
    this.rolesPermissions = rolesPermissions;
    return this;
  }

  public setUsersPermissions(
    usersPermissions: Permissions<UserId>,
  ): CommandOptions {
    this.usersPermissions = usersPermissions;
    return this;
  }

  public setCategoriesPermissions(
    categoriesPermissions: Permissions<Category>,
  ): CommandOptions {
    this.categoriesPermissions = categoriesPermissions;
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
