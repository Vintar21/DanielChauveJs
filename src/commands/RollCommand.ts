import { reply, send } from "../app";
import { _ } from "../utils/ImportConstants";
import ACommand from "./ACommand";
import { DefaultCommand, addPrefixToTriggers } from "../utils/CommandsUtils";
import User from "../user/User";

const maxUsePerUser: number = 1;

// The famous
export default class RollCommand extends ACommand {
  private static RANGE_MAX: number = 1000;

  constructor() {
    const triggers: Set<RegExp> = addPrefixToTriggers(
      new Set<RegExp>([/roll/i]),
      DefaultCommand.prefix
    );

    super(
      triggers,
      DefaultCommand.replyToUser,
      DefaultCommand.globalCooldown,
      DefaultCommand.userCooldown,
      DefaultCommand.maxUseGlobal,
      maxUsePerUser,
      DefaultCommand.rolesPermissions,
      DefaultCommand.usersPermissions,
      DefaultCommand.prefix
    );
  }

  private roll(): number {
    return Math.floor(Math.random() * (RollCommand.RANGE_MAX - 1)) + 1;
  }

  public execute(
    user: User,
    msgId: string,
    ignoreCooldowns: boolean = false
  ): void {
    var value: number = this.roll();
    var response: string = `${user.username} lance son dé et fait... ${value} !`;

    if (super.canReplyToUser(msgId)) {
      reply(response, msgId);
    } else {
      send(response);
    }

    if (!ignoreCooldowns) {
      super.updateCooldowns(user.userId);
    }
  }
}
