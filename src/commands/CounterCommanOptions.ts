import { ALLOWED, BYPASS, Right, UNALLOWED } from "../utils/CommonUtils";
import { Role, Roles } from "../utils/RoleUtils";
import CommandOptions from "./CommandOptions";
import { seconds } from "../utils/CommonUtils";

export default class CounterCommandOptions extends CommandOptions {
  shouldAlwaysTriggerBehavior: boolean = false;

  // Roles which can modify the value of the counter
  counterModificationPermissions: Map<Role, Right> = new Map([
    [Roles.BROADCASTER, BYPASS],
    [Roles.MOD, ALLOWED],
    [Roles.VIP, UNALLOWED],
    [Roles.SUB, UNALLOWED],
    [Roles.FOLLOWER, UNALLOWED],
    [Roles.NO_ROLE, UNALLOWED],
  ]);

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

  //TODO: allow bypass unallowAllExcept etc
}
