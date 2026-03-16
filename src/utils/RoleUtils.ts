import { HelixUser } from "@twurple/api";
import { Bot } from "@twurple/easy-bot";
import { MainApp } from "../app";
import { Permissions } from "./permissions/Permissions";
import { ChatMessage, ChatUser } from "@twurple/chat";
import { usersCache } from "./user/UserUtils";
import { User } from "./user/User";

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

// Broadcaster = BYPASS | NoRole = UNALLOWED | Others = ALLOWED | Default = UNALLOWED
export function getFollowerOnlyRolesPermissions(): Permissions<Role> {
  const followerOnlyRolesPermissions: Permissions<Role> = new Permissions();
  followerOnlyRolesPermissions.unallowDefault();
  followerOnlyRolesPermissions.bypass(Roles.BROADCASTER);
  followerOnlyRolesPermissions.allowEach([
    Roles.MOD,
    Roles.VIP,
    Roles.SUB,
    Roles.FOLLOWER,
  ]);
  followerOnlyRolesPermissions.unallow(Roles.NO_ROLE);
  return followerOnlyRolesPermissions;
}

// Broadcaster = BYPASS | NoRole, Followers = UNALLOWED | Others = ALLOWED | Default = UNALLOWED
export function getSubOnlyRolesPermissions(): Permissions<Role> {
  const subOnlyRolesPermissions: Permissions<Role> = new Permissions();
  subOnlyRolesPermissions.unallowDefault();
  subOnlyRolesPermissions.bypass(Roles.BROADCASTER);
  subOnlyRolesPermissions.allowEach([Roles.MOD, Roles.VIP, Roles.SUB]);
  subOnlyRolesPermissions.unallowEach([Roles.NO_ROLE, Roles.FOLLOWER]);
  return subOnlyRolesPermissions;
}

// Broadcaster = BYPASS | Mod & VIP = ALLOWED | Others = UNALLOWED | Default = UNALLOWED
export function getVipOnlyRolesPermissions(): Permissions<Role> {
  const vipOnlyPermissions: Permissions<Role> = new Permissions();
  vipOnlyPermissions.unallowDefault();
  vipOnlyPermissions.bypass(Roles.BROADCASTER);
  vipOnlyPermissions.allowEach([Roles.MOD, Roles.VIP]);
  vipOnlyPermissions.unallowEach([Roles.SUB, Roles.FOLLOWER, Roles.NO_ROLE]);
  return vipOnlyPermissions;
}

// Broadcaster = BYPASS | Mod = ALLOWED | Others = UNALLOWED | Default = UNALLOWED
export function getModOnlyRolesPermissions(): Permissions<Role> {
  const modOnlyRolesPermissions: Permissions<Role> = new Permissions();
  modOnlyRolesPermissions.unallowDefault();
  modOnlyRolesPermissions.bypass(Roles.BROADCASTER);
  modOnlyRolesPermissions.allow(Roles.MOD);
  modOnlyRolesPermissions.unallowEach([
    Roles.VIP,
    Roles.SUB,
    Roles.FOLLOWER,
    Roles.NO_ROLE,
  ]);
  return modOnlyRolesPermissions;
}

// Broadcaster = BYPASS | Others = UNALLOWED | Default = UNALLOWED
export function getBroadcasterOnlyRolesPermissions(): Permissions<Role> {
  const modOnlyRolesPermissions: Permissions<Role> = new Permissions();
  modOnlyRolesPermissions.unallowDefault();
  modOnlyRolesPermissions.bypass(Roles.BROADCASTER);
  modOnlyRolesPermissions.unallowEach([
    Roles.MOD,
    Roles.VIP,
    Roles.SUB,
    Roles.FOLLOWER,
    Roles.NO_ROLE,
  ]);
  return modOnlyRolesPermissions;
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
): Promise<boolean> {
  return MainApp.getTwitchClient()
    .getModerationApi()
    .checkUserMod(broadcaster.id, user.id);
}

export async function isVip(
  broadcaster: HelixUser,
  user: HelixUser,
): Promise<boolean> {
  return MainApp.getTwitchClient()
    .getChannelsApi()
    .checkVipForUser(broadcaster.id, user.id);
}

export async function isSub(
  broadcaster: HelixUser,
  user: HelixUser,
): Promise<boolean> {
  return MainApp.getTwitchClient()
    .getSubscriptionsApi()
    .getSubscriptionForUser(broadcaster.id, user.id)
    .then((r) => r !== null);
}

export async function isFollower(
  broadcaster: HelixUser,
  user: HelixUser,
): Promise<boolean> {
  return MainApp.getTwitchClient()
    .getChannelsApi()
    .getChannelFollowers(broadcaster.id, user.id)
    .then((r) => r !== null && r?.data[0].followDate !== null);
}

// Try to remove this function and use only getUserWithRole
export async function getGreaterRole(
  promisedUser: Promise<HelixUser>,
): Promise<Role> {
  var role: Role;
  const user = await promisedUser;

  const userId = Number(user.id);
  const userInCache = usersCache.get(userId);
  if (userInCache) {
    return userInCache.role;
  }

  const twitchClient = MainApp.getTwitchClient();
  const broadcasterUser = await twitchClient.getBroadcaster();

  if (isBroadcaster(broadcasterUser, user)) {
    role = Roles.BROADCASTER;
  } else if (await isMod(broadcasterUser, user)) {
    role = Roles.MOD;
  } else if (await isVip(broadcasterUser, user)) {
    role = Roles.VIP;
  } else if (await isSub(broadcasterUser, user)) {
    role = Roles.SUB;
  } else if (await broadcasterUser.isFollowedBy(user.id)) {
    role = Roles.FOLLOWER;
  } else {
    role = Roles.NO_ROLE;
  }
  return role;
}

export async function getUserWithRole(chatUser: ChatUser): Promise<User> {
  var role: Role;

  const userId = Number(chatUser.userId);
  const userInCache = usersCache.get(userId);
  if (userInCache) {
    return userInCache;
  }

  // Check the current role of the user for its message
  if (chatUser.isBroadcaster) {
    role = Roles.BROADCASTER;
  } else if (chatUser.isMod || chatUser.isLeadMod) {
    role = Roles.MOD;
  } else if (chatUser.isVip) {
    role = Roles.VIP;
  } else if (chatUser.isSubscriber || chatUser.isFounder) {
    role = Roles.SUB;
  }

  if (role) {
    return new User(chatUser.userName, userId, role);
  }

  if (await MainApp.getTwitchClient().getBroadcaster().isFollowedBy(userId)) {
    role = Roles.FOLLOWER;
  } else {
    role = Roles.NO_ROLE;
  }

  const user = new User(chatUser.userName, userId, role);
  usersCache.set(userId, user);
  return user;
}

// Too long because of all awaits
export async function getUserRoles(
  promisedUser: Promise<HelixUser>,
): Promise<Role[]> {
  const roles: Role[] = [];
  const user = await promisedUser;
  const twitchClient = MainApp.getTwitchClient();
  const broadcasterUser = await twitchClient.getBroadcaster();

  if (isBroadcaster(broadcasterUser, user)) {
    roles.push(Roles.BROADCASTER);
  }
  if (await isMod(broadcasterUser, user)) {
    roles.push(Roles.MOD);
  }
  if (await isVip(broadcasterUser, user)) {
    roles.push(Roles.VIP);
  }
  if (await isSub(broadcasterUser, user)) {
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
