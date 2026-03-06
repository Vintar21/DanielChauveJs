import { User } from "./User";

export const undefinedUser: User = new User(undefined, undefined, undefined);
export const timerUser: User = new User(undefined, undefined, undefined);

export const moobotUser: User = new User("Moobot", 1564983, undefined);
export const nightbotUser: User = new User("Nightbot", 19264788, undefined);
export const streamelementsUser: User = new User(
  "streamelements",
  100135110,
  undefined,
);

export const botsUser: User[] = [moobotUser, nightbotUser, streamelementsUser];
