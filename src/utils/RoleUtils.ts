import { HelixUser } from "@twurple/api/lib";
import { Bot } from "@twurple/easy-bot/lib";
import { broadcasterId } from "../config/ConfigLoader";

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

export function isBroadcaster(user: HelixUser): boolean {
  return user.id === broadcasterId;
}

export async function isMod(user: HelixUser, bot: Bot): Promise<boolean> {
  return bot.api.moderation.checkUserMod(broadcasterId, user.id);
}

export async function isVip(user: HelixUser, bot: Bot): Promise<boolean> {
  return bot.api.channels.checkVipForUser(broadcasterId, user.id);
}

export async function getGreaterRole(
  promisedUser: Promise<HelixUser>,
  bot: Bot,
): Promise<Role> {
  var role: Role;
  const user = await promisedUser;

  if (isBroadcaster(user)) {
    role = Roles.BROADCASTER;
  } else if (isMod(user, bot)) {
    role = Roles.MOD;
  } else if (isVip(user, bot)) {
    role = Roles.VIP;
  } else if (user.isSubscribedTo(broadcasterId)) {
    role = Roles.SUB;
  } else if (user.follows(broadcasterId)) {
    role = Roles.FOLLOWER;
  } else {
    role = Roles.NO_ROLE;
  }
  return role;
}
