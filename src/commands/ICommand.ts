import User from "../user/User";

export default interface ICommand {
  match(input: string): boolean;

  execute(user: User, msgId: string, ignoreCooldowns?: boolean): void;

  canExecute(user: User, promisedRole: Promise<symbol>): Promise<boolean>;

  canReplyToUser(msgId: string): boolean;

  getPrefix(): string;
}
