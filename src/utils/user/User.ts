import { undefinedUser, timerUser } from "./UserConstants";

export default class User {
  public username: string;
  public userId: UserId;

  constructor(username: string, userId: UserId) {
    this.username = username;
    this.userId = userId;
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
