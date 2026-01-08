import { reply, send } from "../app";
import { _ } from "../utils/ImportConstants";
import ACommand from "./ACommand";
import { addPrefixToTriggers } from "../utils/CommandsUtils";
import User from "../user/User";
import CommandOptions from "./CommandOptions";

// The famous
export default class RollCommand extends ACommand {
  private static RANGE_MAX: number = 1000;

  private static instance: RollCommand = new RollCommand();

  constructor() {
    const options: CommandOptions = new CommandOptions().setMaxUsePerUser(1);
    options.triggers = addPrefixToTriggers([/roll/i], options.prefix);
    super(options);
  }

  public static getInstance(): RollCommand {
    return RollCommand.instance;
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
