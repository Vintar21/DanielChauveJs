export const commandPrefix = "!";

import { Roles } from "./RoleUtils";
export class DefaultCommand {
  public static replyToUser: boolean = true;

  public static globalCooldown: number = 0; // In miliseconds
  public static userCooldown: number = 0; // In miliseconds

  public static maxUseGlobal: number = -1; // -1 = unlimited
  public static maxUsePerUser: number = -1; // -1 = unlimited

  public static prefix: string = commandPrefix;

  // -1 = not allowed, 0 = allowed, 1 = bypass
  public static rolesPermissions: Map<symbol, number> = new Map([
    [Roles.BROADCASTER, 1],
    [Roles.MOD, 0],
    [Roles.VIP, 0],
    [Roles.SUB, 0],
    [Roles.FOLLOWER, 0],
    [Roles.NO_ROLE, 0],
  ]);

  // Permissions for specific users
  // -1 = not allowed, 0 = allowed, 1 = bypass
  public static usersPermissions: Map<number, number> = new Map();
}

export function addPrefixToTriggers(
  triggers: Set<RegExp>,
  prefix: string
): Set<RegExp> {
  const prefixedTriggers: Set<RegExp> = new Set();
  triggers.forEach((trigger) => {
    prefixedTriggers.add(new RegExp(prefix + trigger.source, trigger.flags));
  });
  return prefixedTriggers;
}
