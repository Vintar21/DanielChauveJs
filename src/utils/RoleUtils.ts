import { HelixUser } from "@twurple/api/lib";
import { Bot } from "@twurple/easy-bot/lib";
import { MainApp } from "../app";
import { Permissions } from "./permissions/Permissions";

export type Role = symbol;

export const Roles = Object.freeze({
  BROADCASTER: Symbol("broadcaster"),
  MOD: Symbol("moderator"),
  VIP: Symbol("vip"),
  SUB: Symbol("subscriber"),
  FOLLOWER: Symbol("follower"),
  NO_ROLE: Symbol("noRole"),
});

export const ALL_ROLES: Role[] = [
  Roles.BROADCASTER,
  Roles.MOD,
  Roles.VIP,
  Roles.SUB,
  Roles.FOLLOWER,
  Roles.NO_ROLE,
];

// Broadcaster = BYPASS | Others = ALLOWED | Default = ALLOWED
export function getDefaultRolesPermissions(): Permissions<Role> {
  const defaultRolesPermissions: Permissions<Role> = new Permissions();
  defaultRolesPermissions.allowDefault();
  defaultRolesPermissions.bypass(Roles.BROADCASTER);
  defaultRolesPermissions.allowEach([
    Roles.MOD,
    Roles.VIP,
    Roles.SUB,
    Roles.FOLLOWER,
    Roles.NO_ROLE,
  ]);
  return defaultRolesPermissions;
}

// Broadcaster = BYPASS | Mod = ALLOWED | Others = UNALLOWED Default = UNALLOWED
export function getModOnlyRolesPermissions(): Permissions<Role> {
  const defaultRolesPermissions: Permissions<Role> = new Permissions();
  defaultRolesPermissions.unallowDefault();
  defaultRolesPermissions.bypass(Roles.BROADCASTER);
  defaultRolesPermissions.allow(Roles.MOD);
  defaultRolesPermissions.unallowEach([
    Roles.VIP,
    Roles.SUB,
    Roles.FOLLOWER,
    Roles.NO_ROLE,
  ]);
  return defaultRolesPermissions;
}

// Broadcaster = BYPASS | Mod & VIP = ALLOWED | Others = UNALLOWED Default = UNALLOWED
export function getVipOnlyRolesPermissions(): Permissions<Role> {
  const defaultRolesPermissions: Permissions<Role> = new Permissions();
  defaultRolesPermissions.unallowDefault();
  defaultRolesPermissions.bypass(Roles.BROADCASTER);
  defaultRolesPermissions.allowEach([Roles.MOD, Roles.VIP]);
  defaultRolesPermissions.unallowEach([
    Roles.SUB,
    Roles.FOLLOWER,
    Roles.NO_ROLE,
  ]);
  return defaultRolesPermissions;
}

export function isBroadcaster(
  broadcaster: HelixUser,
  user: HelixUser,
): boolean {
  return user.id === broadcaster.id;
}

export async function isMod(
  broadcaster: HelixUser,
  user: HelixUser,
  bot: Bot,
): Promise<boolean> {
  return bot.api.moderation.checkUserMod(broadcaster.id, user.id);
}

export async function isVip(
  broadcaster: HelixUser,
  user: HelixUser,
  bot: Bot,
): Promise<boolean> {
  return bot.api.channels.checkVipForUser(broadcaster.id, user.id);
}

export async function getGreaterRole(
  promisedUser: Promise<HelixUser>,
  bot: Bot,
): Promise<Role> {
  var role: Role;
  const user = await promisedUser;
  const broadcasterUser = await MainApp.getBroadcaster();

  if (isBroadcaster(broadcasterUser, user)) {
    role = Roles.BROADCASTER;
  } else if (isMod(broadcasterUser, user, bot)) {
    role = Roles.MOD;
  } else if (isVip(broadcasterUser, user, bot)) {
    role = Roles.VIP;
  } else if (user.isSubscribedTo(broadcasterUser.id)) {
    role = Roles.SUB;
  } else if (user.follows(broadcasterUser.id)) {
    role = Roles.FOLLOWER;
  } else {
    role = Roles.NO_ROLE;
  }
  return role;
}
