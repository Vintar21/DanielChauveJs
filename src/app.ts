import { HelixUser } from "@twurple/api/lib";
import { refreshUserToken, StaticAuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import { MessageEvent } from "@twurple/easy-bot/lib";
import ChannelPointsListener from "./channel-points-rewards/ChannelPointsListener";
import CommandsManager from "./commands/CommandsManager";
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
import { onMessage, onRaid } from "./twitch/TwitchEventHandlers";
import { allCounterCommands } from "./commands/counters/AllCounterCommands";

export const canUseSqlBase: boolean = !sqlLightTesting;
export const canUseObsWebsocket: boolean = !obsLightTesting;

export class MainApp {
  static broadcaster: HelixUser;

  static discordClient: DiscordClient = new DiscordClient();
  static obsManager: ObsManager;
  static commandsManager: CommandsManager;
  static channelPointsListener: ChannelPointsListener;
  static timerManager: TimerManager = TimerManager.getInstanceAndInit();

  static broadcasterApp: Bot;
  static botApp: Bot;

  public static async start(): Promise<void> {
    const broadcasterAccessToken = await refreshUserToken(
      broadcasterClientId,
      broadcasterClientSecret,
      broadcasterRefreshToken,
    );

    const broadcasterAuthProvider: StaticAuthProvider = new StaticAuthProvider(
      broadcasterClientId,
      broadcasterAccessToken,
    );
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
    MainApp.obsManager = await ObsManager.getInstanceAndInit();
    MainApp.channelPointsListener =
      await ChannelPointsListener.getInstanceAndInit(MainApp.broadcasterApp);
    await MainApp.timerManager.startAllTimers();
    await CountersManager.initAllCounters();

    // wait dans le doute quand même
    allCounterCommands.forEach((command) => command.initCountersMapIfEmpty());

    console.log("### Bot started ###");

    MainApp.botApp.onMessage(onMessage);

    MainApp.botApp.onRaid(onRaid);
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

MainApp.start();
