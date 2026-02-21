import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../utils/user/User";
import { Role } from "../utils/RoleUtils";

export default interface ICommand {
  match(input: string, game: string): boolean;

  execute(user: User, event: MessageEvent, ignoreCooldowns?: boolean): void;

  canExecute(user: User): Promise<boolean>;

  canReplyToUser(event: MessageEvent): boolean;

  getPrefix(): string;

  isEnabled(): boolean;
}
