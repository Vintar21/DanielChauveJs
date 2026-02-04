import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../user/User";

export default interface ICommand {
  match(input: string): boolean;

  execute(user: User, event: MessageEvent, ignoreCooldowns?: boolean): void;

  canExecute(user: User, promisedRole: Promise<symbol>): Promise<boolean>;

  canReplyToUser(event: MessageEvent): boolean;

  getPrefix(): string;
}
