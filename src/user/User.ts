export default class User {
  public username: string;
  public userId: number;
  // TODO: refaire le userstate dans un vrai objet ici

  constructor(username: string, userId: number) {
    this.username = username;
    this.userId = userId;
  }
}
