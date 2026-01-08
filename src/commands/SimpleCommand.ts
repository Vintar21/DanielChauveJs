import { reply, send } from "../app";
import { _ } from "../utils/ImportConstants";
import ACommand from "./ACommand";
export default class Command extends ACommand {
  private response: string;

  constructor(
    triggers: Set<RegExp>,
    response: string,
    replyToUser: boolean,
    globalCooldown: number,
    userCooldown: number,
    maxUseGlobal: number,
    maxUsePerUser: number,
    rolesPermissions: Map<symbol, number>,
    usersPermissions: Map<number, number>,
    prefix: string
  ) {
    super(
      triggers,
      replyToUser,
      globalCooldown,
      userCooldown,
      maxUseGlobal,
      maxUsePerUser,
      rolesPermissions,
      usersPermissions,
      prefix
    );
    this.response = response;
  }

  public execute(
    userId: number = undefined,
    msgId: string = undefined,
    ignoreCooldowns: boolean = false
  ): void {
    if (super.canReplyToUser(msgId)) {
      reply(this.response, msgId);
    } else {
      send(this.response);
    }

    if (!ignoreCooldowns) {
      super.updateCooldowns(userId);
    }
  }
}
