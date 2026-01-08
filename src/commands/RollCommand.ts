import { reply, send } from "../app";
import {
  _,
  obsWebSocketUrl,
  obsWebSocketPassword,
} from "../utils/ImportConstants";
import ACommand from "./ACommand";
import { addPrefixToTriggers } from "../utils/CommandsUtils";
import User from "../user/User";
import CommandOptions from "./CommandOptions";
import OBSWebSocket from "obs-websocket-js";

// The famous
export default class RollCommand extends ACommand {
  private static RANGE_MAX: number = 1000;

  private static instance: RollCommand = new RollCommand();

  private currentMVP = { user: undefined, score: 0 };

  //TODO: probablement à déplacer autre part
  private obs: OBSWebSocket = new OBSWebSocket();

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

  // TODO "!roll pour devenir MVP" on init
  private updateMvp(user: User, value: number): void {
    // On OBS
    try {
      this.obs.connect(obsWebSocketUrl, obsWebSocketPassword).then(() =>
        this.obs.call("SetInputSettings", {
          inputName: "MVP",
          inputSettings: {
            text: `MVP : ${user.username} - ${value}`,
          },
        })
      );
    } catch (e) {
      console.log("MVP obs source couldn't be updated");
      console.log(e);
    }

    // Update currentMVP
    this.currentMVP = { user: user, score: value };
  }

  public execute(
    user: User,
    msgId: string,
    ignoreCooldowns: boolean = false
  ): void {
    var value: number = this.roll();
    var response: string = `${user.username} lance son dé et fait... ${value} !`;

    if (value > this.currentMVP.score) {
      if (this.currentMVP.user === undefined) {
        // No current MVP
        response += ` Et iel devient notre premièr·e MVP du stream !!!`;
      } else if (user.userId === this.currentMVP.user.userId) {
        // MVP is the same user
        response += ` Et iel confirme son statut de MVP !!!`;
      } else {
        // MVP is another user
        response += ` Et iel devient le·a nouvel·le MVP en humiliant @${this.currentMVP.user.username}!!!`;
      }
      this.updateMvp(user, value);
    } else if (value === this.currentMVP.score) {
      if (user.userId === this.currentMVP.user.userId) {
        // MVP is the same user
        response += ` Et iel refait le même lancer pour confirmer son statut de MVP !!!`;
      } else {
        // MVP is another user
        response += ` Et iel vole le MVP en égalisant @${this.currentMVP.user.username}!!!`;
      }
      this.updateMvp(user, value);
    }

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
