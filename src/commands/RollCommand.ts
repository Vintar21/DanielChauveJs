import { reply, send } from "../app";
import {
  _,
  obsWebSocketUrl,
  obsWebSocketPassword,
  sqlConnectionString,
} from "../utils/ImportConstants";
import ACommand from "./ACommand";
import { addPrefixToTriggers } from "../utils/CommandsUtils";
import { EMPTY, SPACE } from "../utils/StringConstants";
import User from "../user/User";
import CommandOptions from "./CommandOptions";
import OBSWebSocket from "obs-websocket-js";

import sql from "msnodesqlv8";
import Connection = MsNodeSqlV8.Connection;
import ConnectionPromises = MsNodeSqlV8.ConnectionPromises;

// The famous
export default class RollCommand extends ACommand {
  private static RANGE_MAX: number = 1000;

  private connection: Promise<Connection> =
    sql.promises.open(sqlConnectionString);

  private static instance: RollCommand = new RollCommand();

  private currentMVP = { user: undefined, score: 0 };

  //TODO: probablement à déplacer autre part
  private obs: OBSWebSocket = new OBSWebSocket();

  constructor() {
    const options: CommandOptions = new CommandOptions().setMaxUsePerUser(1);
    options.triggers = addPrefixToTriggers([/roll/i], options.prefix);
    super(options);
    // TODO: create another command to reset MVP + reset when stream starts
    this.updateObsMvpSource("!roll pour devenir MVP");
  }

  public static getInstance(): RollCommand {
    return RollCommand.instance;
  }

  private roll(): number {
    return Math.floor(Math.random() * (RollCommand.RANGE_MAX - 1)) + 1;
  }

  private updateObsMvpSource(text: string): void {
    try {
      this.obs.connect(obsWebSocketUrl, obsWebSocketPassword).then(() =>
        this.obs.call("SetInputSettings", {
          inputName: "MVP",
          inputSettings: {
            text,
          },
        })
      );
    } catch (e) {
      console.log("MVP OBS source couldn't be updated");
      console.log(e);
    }
  }

  private updateMvp(user: User, value: number): void {
    // On OBS
    this.updateObsMvpSource(`MVP : ${user.username} - ${value}`);

    // Update currentMVP
    this.currentMVP = { user: user, score: value };
  }

  private async insertValue(
    userId: string,
    username: string,
    value: number
  ): Promise<any> {
    try {
      console.log("Connection opened");
      const con = await this.connection;
      const promises: ConnectionPromises = con.promises;
      var queryAgregator;
      queryAgregator = await promises.query(
        `SELECT id FROM users WHERE id=${userId}`
      );
      const isKnownUser = queryAgregator["first"].length > 0;
      // If it's a new user, register it
      if (!isKnownUser) {
        console.log("New user detected: " + username);
        const insertUserQuery = `INSERT INTO users (id, username) VALUES (${userId}, '${username}');`;
        queryAgregator = await promises.query(insertUserQuery);
      }

      queryAgregator = await promises.query(
        `INSERT INTO rolls (userId, score, dateRoll) VALUES (${userId}, ${value}, GETDATE());`
      );
      console.log("Roll added: " + queryAgregator["counts"]);
    } catch (err) {
      console.log("SQL ERROR: " + err.message);
    }
  }

  private async getCustomMessage(value: number): Promise<String> {
    try {
      console.log("Connection custom message opened");
      const con = await this.connection;
      const promises: ConnectionPromises = con.promises;
      var queryAgregator;
      queryAgregator = await promises.query(
        `SELECT roll_message, proba FROM rolls_messages WHERE result=${value}`
      );
      const res = queryAgregator["first"];
      if (
        res === undefined ||
        res.length === 0 ||
        res[0].roll_message === null
      ) {
        return EMPTY;
      }

      var availableMessages: String[] = [];
      // TODO create interface for sql datas
      res.forEach((row: any) => {
        for (let i = 0; i < row.proba; i++) {
          availableMessages.push(row.roll_message);
        }
      });
      console.log(availableMessages);
      const ind: number = Math.floor(Math.random() * availableMessages.length);
      return SPACE + availableMessages[ind];
    } catch (err) {
      console.log("SQL ERROR: " + err.message);
      return EMPTY;
    }
  }

  // TODO: MessaageUtils avec les parties de message
  public async execute(
    user: User,
    msgId: string,
    ignoreCooldowns: boolean = false
  ): Promise<void> {
    var value: number = this.roll();
    var response: string = `${user.username} lance son dé et fait... ${value} !`;
    this.insertValue(user.userId.toString(), user.username, value);
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
      //TODO: nombre de follower
      this.updateMvp(user, value);
    }

    const customMessage = await this.getCustomMessage(value);
    response += customMessage;

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
