import { HelixUser } from "@twurple/api/lib";
import {
  RefreshingAuthProvider,
  refreshUserToken,
  StaticAuthProvider,
} from "@twurple/auth";
import { Bot, RaidEvent } from "@twurple/easy-bot";
import { MessageEvent } from "@twurple/easy-bot/lib";
import ChannelPointsListener from "./channel-points-rewards/ChannelPointsListener";
import CommandsManager from "./commands/CommandsManager";
import { allCounterCommands } from "./commands/counters/AllCounterCommands";
import {
  botAccessToken,
  botClientId,
  broadcasterClientId,
  broadcasterClientSecret,
  broadcasterRefreshToken,
  channel,
  obsLightTesting,
  sqlLightTesting,
} from "./config/ConfigLoader";
import CountersManager from "./counters/CountersManager";
import DiscordClient from "./discord/DiscordClient";
import ObsManager from "./obs/ObsManager";
import TimerManager from "./timers/TimerManager";
import { onMessage } from "./twitch/TwitchEventHandlers";

import { EventSubWsListener } from "@twurple/eventsub-ws";
import * as fs from "fs";
import { log, minutes, seconds, warn } from "./utils/CommonUtils";
import { BackgroundColors, EMPTY, SPACE } from "./utils/StringConstants";
import User from "./utils/user/User";

export const canUseSqlBase: boolean = !sqlLightTesting;
export const canUseObsWebsocket: boolean = !obsLightTesting;
/*
async function getTwitchConfigJson() {
  // Ici votre fonction pour récupérer le token initial.
  return JSON.parse(
    await fs.readFileSync("./configs/configTwitch.json", "utf-8"),
  );
}
async function updateTokenData(userId, newTokenData) {
  log("Token refreshed");
  // Ici votre fonction pour modifier le token.
  /*var jsonData = await getTwitchConfigJson();
  jsonData["broadcaster-access-token"] = newTokenData;
  await fs.writeFileSync(
    "./configs/configTwitch.json",
    JSON.stringify(jsonData, null, 4),
    "utf-8",
  );
}*/

export class MainApp {
  static broadcaster: HelixUser;

  static discordClient: DiscordClient = new DiscordClient();
  static obsManager: ObsManager;
  static commandsManager: CommandsManager;
  static channelPointsListener: ChannelPointsListener;
  static timerManager: TimerManager = TimerManager.getInstanceAndInit();

  static broadcasterApp: Bot;
  static botApp: Bot;

  public async start(): Promise<void> {
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

    // TODO: remove useless things for OAuth
    //broadcasterAuthProvider.onRefresh(updateTokenData);
    broadcasterAuthProvider.addUserForToken(broadcasterAccessToken, ["chat"]);

    MainApp.broadcasterApp = new Bot({
      authProvider: broadcasterAuthProvider,
      channels: [channel],
    });

    MainApp.botApp = MainApp.broadcasterApp;
    if (botClientId && botAccessToken) {
      // TODO: Limit bot rights ? Just need to send message as broadcaster has all other rights ?
      const botAuthProvider: StaticAuthProvider = new StaticAuthProvider(
        botClientId,
        botAccessToken,
      );

      MainApp.botApp = new Bot({
        authProvider: botAuthProvider,
        channels: [channel],
      });
    }

    MainApp.broadcaster = await MainApp.botApp.api.users.getUserByName(channel);

    MainApp.commandsManager = CommandsManager.getInstanceAndInit();
    await MainApp.discordClient.start();
    // TODO: retry on stream launched
    MainApp.obsManager = await ObsManager.getInstanceAndInit();
    MainApp.channelPointsListener =
      await ChannelPointsListener.getInstanceAndInit(MainApp.broadcasterApp);
    await MainApp.timerManager.startAllTimers();
    await CountersManager.initAllCounters();

    // wait dans le doute quand même
    allCounterCommands.forEach((command) => command.initCountersMapIfEmpty());

    log(`############## Bot started ##############`, BackgroundColors.GREEN);

    MainApp.botApp.onMessage(onMessage);

    MainApp.botApp.onRaid(this.onRaid);

    const onStreamListener = new EventSubWsListener({
      apiClient: MainApp.botApp.api,
    });

    onStreamListener.start();
    onStreamListener.onStreamOnline(
      MainApp.getBroadcasterId(),
      async (event) => {
        log("Stream Online !");
        if (!MainApp.obsManager.isReady()) {
          await MainApp.obsManager.connect();
        }
        // In fact, no need to reaffect CommandManager
        MainApp.commandsManager = CommandsManager.getInstanceAndInit();
        MainApp.raidersIdWaiting = [];
        MainApp.shoutedOutIds.clear();

        const broadcaster = MainApp.getBroadcaster();
        var stream = await event.getStream();
        if (stream === null) {
          log("No current stream via twitch API");
          setTimeout(async () => {
            log("Try resending live announce");
            MainApp.discordClient.sendLiveAnounce(
              await broadcaster.getStream(),
              broadcaster,
            );
          }, minutes(1));
        } else {
          log("Sending live announce directly");
          MainApp.discordClient.sendLiveAnounce(stream, broadcaster);
        }
      },
    );
  }

  private static async shoutout(userId: string): Promise<void> {
    const currentStream = await MainApp.getBroadcaster().getStream();
    if (!currentStream || currentStream === null || !currentStream.startDate) {
      const user = await MainApp.broadcasterApp.api.users.getUserById(userId);
      const username = user === null ? EMPTY : user.name;
      send(
        `Merci pour le raid ${username}${username === EMPTY ? EMPTY : SPACE}! Même si l'autre est pas en stream LUL`,
      );
      return;
    }
    return MainApp.broadcasterApp.api.chat.shoutoutUser(
      MainApp.getBroadcasterId(),
      userId,
    );
  }

  private static async futureShoutout() {
    if (MainApp.raidersIdWaiting.length > 0) {
      const userIdToShoutout = MainApp.raidersIdWaiting[0];
      try {
        await MainApp.shoutout(userIdToShoutout);
        MainApp.shoutedOutIds.add(userIdToShoutout);
        MainApp.raidersIdWaiting = MainApp.raidersIdWaiting.slice(1);
        MainApp.lastShoutout = Date.now();
        // If we still have users to SO, program a SO in the future
        if (MainApp.raidersIdWaiting.length > 0) {
          setTimeout(() => MainApp.futureShoutout, MainApp.SHOUTOUT_COOLDOWN);
        }
      } catch (err) {
        warn(err);
      }
    }
  }

  // Waiting list of shoutouts to handle several raids in less than 2 minutes
  private static raidersIdWaiting: string[] = [];
  // People already so during the stream
  private static shoutedOutIds: Set<string> = new Set();
  private static lastShoutout: number;
  // True Twitch cooldown is 2 minutes but we wait a bit longer
  private static SHOUTOUT_COOLDOWN = minutes(2) + seconds(30);

  private async onRaid(event: RaidEvent) {
    log(
      `Raid received by ${event.userName} | WaitingList: ${MainApp.raidersIdWaiting}`,
    );
    if (
      MainApp.shoutedOutIds.has(event.userId) ||
      MainApp.raidersIdWaiting.includes(event.userId)
    ) {
      log("Already raided the channel during this stream");
      return;
    }

    // No shoutout yet or cooldown finished
    if (
      !MainApp.lastShoutout ||
      Date.now() - MainApp.lastShoutout > MainApp.SHOUTOUT_COOLDOWN
    ) {
      MainApp.shoutedOutIds.add(event.userId);
      MainApp.lastShoutout = Date.now();
      MainApp.shoutout(event.userId);
      return;
    }

    const timeSinceLastShoutout = Date.now() - MainApp.lastShoutout;
    MainApp.raidersIdWaiting.push(event.userId);
    setTimeout(
      MainApp.futureShoutout,
      MainApp.SHOUTOUT_COOLDOWN - timeSinceLastShoutout,
    );
  }

  public static getBroadcaster(): HelixUser {
    return MainApp.broadcaster;
  }

  public static getBroadcasterId(): string {
    return MainApp.broadcaster.id;
  }

  public static getDiscordClient(): DiscordClient {
    return MainApp.discordClient;
  }

  public static getObsManager(): ObsManager {
    return MainApp.obsManager;
  }

  public static getCommandsManager(): CommandsManager {
    return MainApp.commandsManager;
  }

  public static getChannelPointsListener(): ChannelPointsListener {
    return MainApp.channelPointsListener;
  }

  public static getTimerManager(): TimerManager {
    return MainApp.timerManager;
  }

  public static async getCurrentGame(): Promise<string | undefined> {
    return MainApp.broadcasterApp.api.channels
      .getChannelInfoById(MainApp.getBroadcasterId())
      .then((channel) => channel?.gameName);
  }
}

export function send(message: String, isAnnounce: boolean = false) {
  if (isAnnounce) {
    MainApp.botApp.announce(channel, message.toString());
  } else {
    MainApp.botApp.say(channel, message.toString());
  }
}

export function reply(message: String, event: MessageEvent) {
  // use bot.reply instead ? How ?
  event.reply(message.toString());
}

const app = new MainApp();
app.start();
