import User from "../../user/User";
import { channel } from "../../utils/ImportConstants";
import { Roles } from "../../utils/RoleUtils";
import ACommand from "../ACommand";
import CommandOptions from "../CommandOptions";
import { MessageEvent } from "@twurple/easy-bot";
import { SPACE, SLASH } from "../../utils/StringConstants";

export default class MultiCommand extends ACommand {
  // The broadcaster channel is always in the link
  private channels: string[] = [channel];
  private static linkPrefix: string = "https://kadgar.net/live/";
  private static messageStart: string = "Pour suivre toutes les POVs: ";

  constructor() {
    const options: CommandOptions = new CommandOptions([
      /multi/i,
    ]).unallowAllRolesExcept([Roles.BROADCASTER, Roles.MOD, Roles.VIP]);
    super(options);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    const messageParts: string[] = event.text.trim().split(SPACE);
    // [!multi, firstchannel, ...]
    if (messageParts.length > 1) {
      this.channels.concat(messageParts.slice(1));
    }
    const message =
      MultiCommand.messageStart +
      MultiCommand.linkPrefix +
      this.channels.join(SLASH);
    // TODO: Pin the message
    this.replyOrSend(user, event, ignoreCooldowns, message);
  }
}
