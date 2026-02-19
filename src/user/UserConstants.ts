import User from "./User";

export const undefinedUser: User = new User(undefined, undefined);
export const timerUser: User = new User(undefined, undefined);

export const moobotUser: User = new User("Moobot", 1564983);
export const nightbotUser: User = new User("Nightbot", 19264788);
export const streamelementsUser: User = new User("streamelements", 100135110);

export const botsUser: User[] = [moobotUser, nightbotUser, streamelementsUser];
