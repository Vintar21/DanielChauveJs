import { HelixUser } from "@twurple/api/lib";
import { Bot } from "@twurple/easy-bot/lib";
import { MainApp } from "../app";
import { Permissions } from "./permissions/Permissions";

export type Role = number;

export const Roles = Object.freeze({
  BROADCASTER: 5,
  MOD: 4,
  VIP: 3,
  SUB: 2,
  FOLLOWER: 1,
  NO_ROLE: 0,
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

export async function isSub(
  broadcaster: HelixUser,
  user: HelixUser,
  bot: Bot,
): Promise<boolean> {
  return bot.api.subscriptions
    .getSubscriptionForUser(broadcaster.id, user.id)
    .then((r) => r !== null);
}

export async function isFollower(
  broadcaster: HelixUser,
  user: HelixUser,
  bot: Bot,
): Promise<boolean> {
  return bot.api.channels
    .getChannelFollowers(broadcaster.id, user.id)
    .then((r) => r !== null && r?.data[0].followDate !== null);
}

export async function getGreaterRole(
  promisedUser: Promise<HelixUser>,
  bot: Bot,
): Promise<Role> {
  var role: Role;
  const user = await promisedUser;
  const twitchClient = MainApp.getTwitchClient();
  const broadcasterUser = await twitchClient.getBroadcaster();

  if (isBroadcaster(broadcasterUser, user)) {
    role = Roles.BROADCASTER;
  } else if (await isMod(broadcasterUser, user, bot)) {
    role = Roles.MOD;
  } else if (await isVip(broadcasterUser, user, bot)) {
    role = Roles.VIP;
  } else if (await isSub(broadcasterUser, user, bot)) {
    role = Roles.SUB;
  } else if (await broadcasterUser.isFollowedBy(user.id)) {
    role = Roles.FOLLOWER;
  } else {
    role = Roles.NO_ROLE;
  }
  return role;
}

// Too long because of all awaits
export async function getUserRoles(
  promisedUser: Promise<HelixUser>,
  bot: Bot,
): Promise<Role[]> {
  const roles: Role[] = [];
  const user = await promisedUser;
  const twitchClient = MainApp.getTwitchClient();
  const broadcasterUser = await twitchClient.getBroadcaster();

  if (isBroadcaster(broadcasterUser, user)) {
    roles.push(Roles.BROADCASTER);
  }
  if (await isMod(broadcasterUser, user, bot)) {
    roles.push(Roles.MOD);
  }
  if (await isVip(broadcasterUser, user, bot)) {
    roles.push(Roles.VIP);
  }
  if (await isSub(broadcasterUser, user, bot)) {
    roles.push(Roles.SUB);
  }
  if (await broadcasterUser.isFollowedBy(user.id)) {
    roles.push(Roles.FOLLOWER);
  }
  if (roles.length === 0) {
    roles.push(Roles.NO_ROLE);
  }
  return roles;
}
