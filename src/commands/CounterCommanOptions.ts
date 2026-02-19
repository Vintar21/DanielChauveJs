import { seconds } from "../utils/CommonUtils";
import { Permissions } from "../utils/PermissionsUtils";
import { getModOnlyRolesPermissions, Role } from "../utils/RoleUtils";
import CommandOptions from "./CommandOptions";

export default class CounterCommandOptions extends CommandOptions {
  shouldAlwaysTriggerBehavior: boolean = false;
  initIfNoCounterForCategory: boolean = false;

  // Roles which can modify the value of the counter
  counterModificationPermissions: Permissions<Role> =
    getModOnlyRolesPermissions();

  constructor(triggers: Array<RegExp>) {
    super(triggers);
    // Greater global cooldowns to avoid several modifications for the same thing because of stream delay
    this.globalCooldown = seconds(3);
  }

  public alwaysTriggerBehavior(
    alwaysTriggerBehavior: boolean,
  ): CounterCommandOptions {
    this.shouldAlwaysTriggerBehavior = alwaysTriggerBehavior;
    return this;
  }

  public canInitIfNoCounterForCategory(): CounterCommandOptions {
    this.initIfNoCounterForCategory = true;
    return this;
  }

  public cantInitIfNoCounterForCategory(): CounterCommandOptions {
    this.initIfNoCounterForCategory = false;
    return this;
  }

  public setCounterModificationPermissions(
    rolesPermissions: Permissions<Role>,
  ) {
    this.counterModificationPermissions = rolesPermissions;
  }
}
