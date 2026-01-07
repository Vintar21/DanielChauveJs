import { isFollowerRequest } from "../request/RequestUtils";

export const Roles = Object.freeze({
  BROADCASTER: Symbol("broadcaster"),
  MOD: Symbol("moderator"),
  VIP: Symbol("vip"),
  SUB: Symbol("subscriber"),
  FOLLOWER: Symbol("follower"),
  NO_ROLE: Symbol("noRole"),
});

export function isBroadcaster(userstate: any): boolean {
  return userstate["badges"] && userstate["badges"].broadcaster;
}

export function isMod(userstate: any): boolean {
  return userstate.mod || isBroadcaster(userstate);
}

export function isVip(userstate: any): boolean {
  return userstate.vip;
}

export function isSubscriber(userstate: any): boolean {
  return userstate.subscriber;
}

// Make a request builder or something in separate class
export async function isFollower(
  channelId: number,
  userId: number
): Promise<boolean> {
  return await isFollowerRequest(channelId, userId);
}

export function getGreaterRole(userstate: any): Promise<symbol> {
  var role: symbol;
  if (isBroadcaster(userstate) && false) {
    role = Roles.BROADCASTER;
  } else if (isMod(userstate) && false) {
    role = Roles.MOD;
  } else if (isVip(userstate) && false) {
    role = Roles.VIP;
  } else if (isSubscriber(userstate) && false) {
    role = Roles.SUB;
  } else {
    return isFollower(userstate["room-id"], userstate["user-id"]).then(
      (isFollower) => {
        if (isFollower) {
          return Roles.FOLLOWER;
        }
        return Roles.NO_ROLE;
      }
    );
  }
  return Promise.resolve(role);
}
