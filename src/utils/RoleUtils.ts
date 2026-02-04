import { ApiClient, HelixUser } from "@twurple/api/lib";
import { Bot } from "@twurple/easy-bot/lib";

export const Roles = Object.freeze({
  BROADCASTER: Symbol("broadcaster"),
  MOD: Symbol("moderator"),
  VIP: Symbol("vip"),
  SUB: Symbol("subscriber"),
  FOLLOWER: Symbol("follower"),
  NO_ROLE: Symbol("noRole"),
});

export function isBroadcaster(
  user: HelixUser,
  broadcaster: HelixUser,
): boolean {
  return user.id === broadcaster.id;
}

export async function isMod(
  user: HelixUser,
  broadcaster: HelixUser,
  bot: Bot,
): Promise<boolean> {
  return bot.api.moderation.checkUserMod(broadcaster.id, user.id);
}

export async function isVip(
  user: HelixUser,
  broadcaster: HelixUser,
  bot: Bot,
): Promise<boolean> {
  return bot.api.channels.checkVipForUser(broadcaster.id, user.id);
}

export async function getGreaterRole(
  promisedUser: Promise<HelixUser>,
  promisedBroadcaster: Promise<HelixUser>,
  bot: Bot,
): Promise<symbol> {
  var role: symbol;
  const user = await promisedUser;
  const broadcaster = await promisedBroadcaster;

  if (isBroadcaster(user, broadcaster)) {
    role = Roles.BROADCASTER;
  } else if (isMod(user, broadcaster, bot)) {
    role = Roles.MOD;
  } else if (isVip(user, broadcaster, bot)) {
    role = Roles.VIP;
  } else if (user.isSubscribedTo(broadcaster)) {
    role = Roles.SUB;
  } else if (user.follows(broadcaster)) {
    role = Roles.FOLLOWER;
  } else {
    role = Roles.NO_ROLE;
  }
  return role;
}
