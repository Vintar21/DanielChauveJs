import { Role } from "../RoleUtils";

export class User {
  public username: string;
  public userId: UserId;
  public role: Promise<Role>;

  constructor(username: string, userId: UserId, role: Promise<Role>) {
    this.username = username;
    this.userId = userId;
    this.role = role;
  }

  public getGreaterRole(): Promise<Role> {
    return this.role;
  }
}

export type UserId = number | undefined;

export function isNotAUser(user: User) {
  return (
    user === undefinedUser ||
    user === timerUser ||
    user === undefined ||
    user.username === undefined ||
    user.userId === undefined
  );
}

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
