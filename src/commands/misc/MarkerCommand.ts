import { MessageEvent } from "@twurple/easy-bot";
import User from "../../user/User";
import { Roles } from "../../utils/RoleUtils";
import CommandOptions from "../CommandOptions";
import ACommand from "../ACommand";
import { bot } from "../../app";
import { broadcasterId } from "../../config/ConfigLoader";

const options: CommandOptions = new CommandOptions([
  /markers?/i,
  /marqueurs?/i,
]).unallowAllRolesExcept([Roles.BROADCASTER, Roles.MOD, Roles.VIP]);

export default class AnswerRandomMessage extends ACommand {
  constructor(enabled: boolean = true) {
    super(options, enabled);
  }

  public execute(
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): void {
    bot.api.streams.createStreamMarker(broadcasterId);
    this.replyOrSend(user, event, ignoreCooldowns, "Marker créé chef !");
  }
}
