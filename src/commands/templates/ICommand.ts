import { ChatMessage } from "@twurple/chat";
import { User } from "../../utils/user/User";

export default interface ICommand {
  match(input: string, game: string): boolean;

  matchAliases(input: string, game: string, formatMessage?: boolean): boolean;

  execute(
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns?: boolean,
  ): void;

  reset(): void;

  canExecute(user: User): Promise<boolean>;

  canReplyToUser(chatMessage: ChatMessage): boolean;

  getPrefix(): string;

  getName(): string;

  getAllStringTriggers(): string[];

  isEnabled(): boolean;
}
