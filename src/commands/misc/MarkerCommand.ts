import { MessageEvent } from "@twurple/easy-bot";
import User from "../../user/User";
import { Roles } from "../../utils/RoleUtils";
import CommandOptions from "../CommandOptions";
import ACommand from "../ACommand";
import { botApp, MainApp } from "../../app";

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
    // Check if stream is online first
    botApp.api.streams.createStreamMarker(MainApp.getBroadcaster().id);
    this.replyOrSend(user, event, ignoreCooldowns, "Marker créé chef !");
  }
}
