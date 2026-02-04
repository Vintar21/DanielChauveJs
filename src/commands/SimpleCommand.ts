import { MessageEvent } from "@twurple/easy-bot/lib";
import { reply, send } from "../app";
import User from "../user/User";
import { addPrefixToTriggers } from "../utils/CommandsUtils";
import ACommand from "./ACommand";
import CommandOptions from "./CommandOptions";

export default class SimpleCommand extends ACommand {
  private response: string;

  constructor(options: CommandOptions, response: string) {
    options.triggers = addPrefixToTriggers(options.triggers, options.prefix);
    super(options);
    this.response = response;
  }

  public execute(
    user: User = undefined,
    event: MessageEvent,
    ignoreCooldowns: boolean = false,
  ): void {
    if (super.canReplyToUser(event)) {
      reply(this.response, event);
    } else {
      send(`@${user.username} ${this.response}`);
    }

    if (!ignoreCooldowns) {
      super.updateCooldowns(user.userId);
    }
  }
}
