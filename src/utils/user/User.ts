import { Role } from "../RoleUtils";
import { timerUser, undefinedUser } from "./UserConstants";

export default class User {
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
