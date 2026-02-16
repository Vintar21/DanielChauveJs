import { MessageEvent } from "@twurple/easy-bot/lib";
import User from "../user/User";
import { Role } from "../utils/RoleUtils";

export default interface ICommand {
  match(input: string): boolean;

  execute(user: User, event: MessageEvent, ignoreCooldowns?: boolean): void;

  canExecute(user: User, promisedRole: Promise<Role>): Promise<boolean>;

  canReplyToUser(event: MessageEvent): boolean;

  getPrefix(): string;

  isEnabled(): boolean;
}
