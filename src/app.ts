import { obsLightTesting, sqlLightTesting } from "./config/ConfigLoader";
import DiscordClient from "./discord/DiscordClient";
import ObsManager from "./obs/ObsManager";

import GoogleSheetManager from "./google/GoogleSheetManager";
import TwitchClient from "./twitch/TwitchClient";
import { log } from "./utils/CommonUtils";
import { BackgroundColors } from "./utils/StringConstants";

export const canUseSqlBase: boolean = !sqlLightTesting;
export const canUseObsWebsocket: boolean = !obsLightTesting;

export class MainApp {
  static twitchClient: TwitchClient;
  static discordClient: DiscordClient = new DiscordClient();
  static obsManager: ObsManager;
  static googleSheetManager: GoogleSheetManager = new GoogleSheetManager();

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

  public static getGoogleSheetManager(): GoogleSheetManager {
    return MainApp.googleSheetManager;
  }
}

const app = new MainApp();
app.start();
