import {
  ApiClient,
  HelixModerationApi,
  HelixUser,
  HelixUserApi,
} from "@twurple/api";
import {
  AuthProvider,
  RefreshingAuthProvider,
  refreshUserToken,
  StaticAuthProvider,
} from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import {
  botAccessToken,
  botClientId,
  broadcasterClientId,
  broadcasterClientSecret,
  broadcasterRefreshToken,
  channel,
} from "../config/ConfigLoader";
import { onMessage } from "./TwitchEventHandlers";
import { allCounterCommands } from "../commands/counters/AllCounterCommands";

export default class TwitchClient {
  private botApp: Bot | undefined;
  private broadcasterApp: Bot | undefined;
  private broadcaster: HelixUser | undefined;

  constructor() {}

  public async init(assignHandlers: boolean = false) {
    // Authentication of broadcasterApp
    const broadcasterAccessToken = await refreshUserToken(
      broadcasterClientId,
      broadcasterClientSecret,
      broadcasterRefreshToken,
    );

    const broadcasterAuthProvider: RefreshingAuthProvider =
      new RefreshingAuthProvider({
        clientId: broadcasterClientId,
        clientSecret: broadcasterClientSecret,
      });

    this.broadcasterApp = new Bot({
      authProvider: broadcasterAuthProvider,
      channels: [channel],
    });

    // Authentication of botApp
    this.botApp = this.broadcasterApp;
    // TODO: modif in config to don't have the fallback twice
    if (botClientId && botAccessToken) {
      // TODO: Limit bot rights ? Just need to send message as broadcaster has all other rights ?
      const botAuthProvider: StaticAuthProvider = new StaticAuthProvider(
        botClientId,
        botAccessToken,
      );

      this.botApp = new Bot({
        authProvider: botAuthProvider,
        channels: [channel],
      });
    }

    const _broadcaster = await this.getApi().users.getUserByName(channel);
    this.broadcaster = _broadcaster !== null ? _broadcaster : undefined;

    if (assignHandlers) {
      // TODO not onMessage but onChatMessage...
      // + TwitchEventHandler may not be sufficient do it directly in this client
      this.botApp.onMessage(onMessage);
    }

    // Who init the OBSManager ? Should definitely not be here

    // ChannelPointListener

    // TimerManager

    // TwitchCommandsManager

    // CountersManager

    //allCounterCommands.forEach((command) => command.initCountersMapIfEmpty());
  }

  // TODO better handling of error (maybe in the mainApp ?)
  public getApi(): ApiClient {
    if (!this.broadcasterApp) {
      throw Error("Bot isn't available, API couldn't be accessed");
    }
    return this.broadcasterApp?.api;
  }

  public createMarker(description?: string): Promise<boolean> {
    if (this.broadcaster) {
      return this.broadcaster.getStream().then((stream) => {
        if (this.broadcaster && stream && stream !== null) {
          this.getApi().streams.createStreamMarker(
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
    return this.getApi().users;
  }

  public getModerationApi(): HelixModerationApi {
    return this.getApi().moderation;
  }
}
