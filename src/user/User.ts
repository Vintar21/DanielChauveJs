export default class User {
  public username: string;
  public userId: number;
  // TODO: refaire le userstate dans un vrai objet ici

  constructor(username: string, userId: number) {
    this.username = username;
    this.userId = userId;
  }
}

export const undefinedUser: User = { username: undefined, userId: undefined };
export const timerUser: User = { username: undefined, userId: undefined };

export function isNotAUser(user: User) {
  return (
    user === undefinedUser ||
    user === timerUser ||
    user === undefined ||
    user.username === undefined ||
    user.userId === undefined
  );
}
