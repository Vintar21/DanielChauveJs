import { obsLightTesting, sqlLightTesting } from "./config/ConfigLoader";
import DiscordClient from "./discord/DiscordClient";
import ObsManager from "./obs/ObsManager";

import TwitchClient from "./twitch/TwitchClient";
import { log } from "./utils/CommonUtils";
import { BackgroundColors } from "./utils/StringConstants";

export const canUseSqlBase: boolean = !sqlLightTesting;
export const canUseObsWebsocket: boolean = !obsLightTesting;

export class MainApp {
  static twitchClient: TwitchClient;
  static discordClient: DiscordClient = new DiscordClient();
  static obsManager: ObsManager;

  public async start(): Promise<void> {
    MainApp.twitchClient = TwitchClient.getInstanceAndInit();

    await MainApp.discordClient.start();
    // TODO: retry on stream launched
    MainApp.obsManager = await ObsManager.getInstanceAndInit();

    log(`############## Bot started ##############`, BackgroundColors.GREEN);
  }

  public static getDiscordClient(): DiscordClient {
    return MainApp.discordClient;
  }

  public static getTwitchClient(): TwitchClient {
    return MainApp.twitchClient;
  }

  public static getObsManager(): ObsManager {
    return MainApp.obsManager;
  }
}

const app = new MainApp();
app.start();
