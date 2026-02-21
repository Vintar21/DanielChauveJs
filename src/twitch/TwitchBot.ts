import { HelixModerationApi, HelixUser, HelixUserApi } from "@twurple/api";
import { AuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import { channel } from "../config/ConfigLoader";
import { onMessage } from "./TwitchEventHandlers";
import { allCounterCommands } from "../commands/counters/AllCounterCommands";

export default class TwitchBot {
  private bot: Bot;
  private broadcaster: HelixUser | undefined;

  constructor(authProvider: AuthProvider) {
    this.bot = new Bot({ authProvider, channels: [channel] });
  }

  public async init(assignHandlers: boolean = false) {
    const _broadcaster = await this.bot.api.users.getUserByName(channel);
    this.broadcaster = _broadcaster !== null ? _broadcaster : undefined;

    if (assignHandlers) {
      this.bot.onMessage(onMessage);
    }

    //allCounterCommands.forEach((command) => command.initCountersMapIfEmpty());
  }

  public createMarker(description?: string): Promise<boolean> {
    if (this.broadcaster) {
      return this.broadcaster.getStream().then((stream) => {
        if (this.broadcaster && stream && stream !== null) {
          this.bot.api.streams.createStreamMarker(
            this.broadcaster?.id,
            description,
          );
          return true;
        }
        return false;
      });
    }
    return Promise.resolve(false);
  }

  public getUsersApi(): HelixUserApi {
    return this.bot.api.users;
  }

  public getModerationApi(): HelixModerationApi {
    return this.bot.api.moderation;
  }
}
