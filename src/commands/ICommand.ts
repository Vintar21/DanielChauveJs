export default interface ICommand {
  match(input: string): boolean;

  execute(userId: number, msgId: string, ignoreCooldowns: boolean): void;

  canExecute(userId: number, promisedRole: Promise<symbol>): Promise<boolean>;

  canReplyToUser(msgId: string): boolean;

  getPrefix(): string;
}
