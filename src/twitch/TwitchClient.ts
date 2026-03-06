import {
  ApiClient,
  HelixChannelApi,
  HelixChatApi,
  HelixModerationApi,
  HelixPollApi,
  HelixPredictionApi,
  HelixUser,
  HelixUserApi,
} from "@twurple/api";
import {
  RefreshingAuthProvider,
  refreshUserToken,
  StaticAuthProvider,
} from "@twurple/auth";
import { Bot, MessageEvent, RaidEvent } from "@twurple/easy-bot";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { MainApp } from "../app";
import ChannelPointsListener from "../channel-points-rewards/ChannelPointsListener";
import CommandsManager from "../commands/CommandsManager";
import { allCounterCommands } from "../commands/counters/AllCounterCommands";
import {
  botAccessToken,
  botClientId,
  broadcasterClientId,
  broadcasterClientSecret,
  broadcasterRefreshToken,
  channel,
} from "../config/ConfigLoader";
import CountersManager from "../counters/CountersManager";
import TimerManager from "../timers/TimerManager";
import { log, minutes, seconds, warn } from "../utils/CommonUtils";
import { EMPTY, SPACE } from "../utils/StringConstants";
import { onMessage } from "./TwitchEventHandlers";

export default class TwitchClient {
  private static botApp: Bot;
  private static broadcasterApp: Bot;
  private static broadcaster: HelixUser;

  static commandsManager: CommandsManager;
  static channelPointsListener: ChannelPointsListener;
  static timerManager: TimerManager = TimerManager.getInstanceAndInit();
  static countersManager: CountersManager;

  private static INSTANCE: TwitchClient;

  constructor() {}

  /* TODO
   * - Create a hierarchy to split this class
   * - Integrate more methods here like createPoll, getUserByName etc...
   * - Try to remove unnecessary use of static
   **/
  public static getInstanceAndInit() {
    if (!TwitchClient.INSTANCE) {
      TwitchClient.INSTANCE = new TwitchClient();
      TwitchClient.INSTANCE.init(true);
    }

    return TwitchClient.INSTANCE;
  }

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

    broadcasterAuthProvider.addUserForToken(broadcasterAccessToken, ["chat"]);

    TwitchClient.broadcasterApp = new Bot({
      authProvider: broadcasterAuthProvider,
      channels: [channel],
    });

    // Authentication of botApp
    TwitchClient.botApp = TwitchClient.broadcasterApp;
    // TODO: modif in config to don't have the fallback twice
    if (botClientId && botAccessToken) {
      // TODO: Limit bot rights ? Just need to send message as broadcaster has all other rights ?
      const botAuthProvider: StaticAuthProvider = new StaticAuthProvider(
        botClientId,
        botAccessToken,
      );

      TwitchClient.botApp = new Bot({
        authProvider: botAuthProvider,
        channels: [channel],
      });
    }

    const _broadcaster = await this.getApi().users.getUserByName(channel);

    if (_broadcaster === null) return;

    TwitchClient.broadcaster = _broadcaster;

    // Who init the OBSManager ? Should definitely not be here

    // ChannelPointListener
    TwitchClient.channelPointsListener =
      await ChannelPointsListener.getInstanceAndInit(this);

    // TimerManager
    TwitchClient.timerManager = TimerManager.getInstanceAndInit();
    TwitchClient.timerManager.startAllTimers();

    // TwitchCommandsManager
    TwitchClient.commandsManager = CommandsManager.getInstanceAndInit();

    // CountersManager
    TwitchClient.countersManager = CountersManager.initAllCounters();
    allCounterCommands.forEach((command) => command.initCountersMapIfEmpty());

    if (assignHandlers) {
      // TODO not onMessage but onChatMessage...
      // + TwitchEventHandler may not be sufficient do it directly in this client
      TwitchClient.botApp.onMessage(onMessage);

      TwitchClient.botApp.onRaid(this.onRaid);
      const onStreamListener = new EventSubWsListener({
        apiClient: this.getApi(),
      });

      onStreamListener.start();
      onStreamListener.onStreamOnline(
        TwitchClient.broadcaster.id,
        async (event) => {
          log("Stream Online !");
          if (!MainApp.obsManager.isReady()) {
            await MainApp.obsManager.connect();
          }
          // In fact, no need to reaffect CommandManager
          TwitchClient.commandsManager = CommandsManager.getInstanceAndInit();
          TwitchClient.raidersIdWaiting = [];
          TwitchClient.shoutedOutIds.clear();

          //const broadcaster = MainApp.getBroadcaster();
          var stream = await event.getStream();
          if (stream === null) {
            log("No current stream via twitch API");
            setTimeout(async () => {
              log("Try resending live announce");
              MainApp.discordClient.sendLiveAnounce(
                await TwitchClient.broadcaster.getStream(),
                TwitchClient.broadcaster,
              );
            }, minutes(1));
          } else {
            log("Sending live announce directly");
            MainApp.discordClient.sendLiveAnounce(
              stream,
              TwitchClient.broadcaster,
            );

            TwitchClient.send(
              "Je suis toujours en phase de test, n'hésitez pas à me mettre à l'épreuve !",
            );
          }
        },
      );
    }
    log("Twitch Client ready !");
  }

  // TODO better handling of error (maybe in the mainApp ?)
  public getApi(): ApiClient {
    if (!TwitchClient.broadcasterApp) {
      throw Error("Bot isn't available, API couldn't be accessed");
    }
    return TwitchClient.broadcasterApp?.api;
  }

  public createMarker(description?: string): Promise<boolean> {
    if (TwitchClient.broadcaster) {
      return TwitchClient.broadcaster.getStream().then((stream) => {
        if (TwitchClient.broadcaster && stream && stream !== null) {
          this.getApi().streams.createStreamMarker(
            TwitchClient.broadcaster?.id,
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

  public getChannelsApi(): HelixChannelApi {
    return this.getApi().channels;
  }

  public getChatApi(): HelixChatApi {
    return this.getApi().chat;
  }

  public getModerationApi(): HelixModerationApi {
    return this.getApi().moderation;
  }

  public getPollsApi(): HelixPollApi {
    return this.getApi().polls;
  }

  public getPredictionApi(): HelixPredictionApi {
    return this.getApi().predictions;
  }

  public getBroadcaster(): HelixUser {
    return TwitchClient.broadcaster;
  }

  public getBroadcasterId(): string {
    return this.getBroadcaster().id;
  }

  public getBroadcasterApp(): Bot {
    return TwitchClient.broadcasterApp;
  }

  public static getCommandsManager(): CommandsManager {
    return TwitchClient.commandsManager;
  }

  public static getChannelPointsListener(): ChannelPointsListener {
    return TwitchClient.channelPointsListener;
  }

  public static getTimerManager(): TimerManager {
    return TwitchClient.timerManager;
  }

  public async getCurrentGame(): Promise<string | undefined> {
    return this.getChannelsApi()
      .getChannelInfoById(this.getBroadcasterId())
      .then((channel) => channel?.gameName);
  }

  public static send(message: String, isAnnounce: boolean = false) {
    if (isAnnounce) {
      TwitchClient.botApp.announce(channel, message.toString());
    } else {
      TwitchClient.botApp.say(channel, message.toString());
    }
  }

  public reply(message: String, event: MessageEvent) {
    // use bot.reply instead ? How ?
    event.reply(message.toString());
  }

  // Listeners/Handlers
  private async shoutout(userId: string): Promise<void> {
    const currentStream = await this.getBroadcaster().getStream();
    if (!currentStream || currentStream === null || !currentStream.startDate) {
      const user = await this.getUsersApi().getUserById(userId);
      const username = user === null ? EMPTY : user.name;
      TwitchClient.send(
        `Merci pour le raid ${username}${username === EMPTY ? EMPTY : SPACE}! Même si l'autre est pas en stream LUL`,
      );
      return;
    }
    return this.getChatApi().shoutoutUser(this.getBroadcasterId(), userId);
  }

  private async futureShoutout() {
    if (TwitchClient.raidersIdWaiting.length > 0) {
      const userIdToShoutout = TwitchClient.raidersIdWaiting[0];
      try {
        await this.shoutout(userIdToShoutout);
        TwitchClient.shoutedOutIds.add(userIdToShoutout);
        TwitchClient.raidersIdWaiting = TwitchClient.raidersIdWaiting.slice(1);
        TwitchClient.lastShoutout = Date.now();
        // If we still have users to SO, program a SO in the future
        if (TwitchClient.raidersIdWaiting.length > 0) {
          setTimeout(() => this.futureShoutout, TwitchClient.SHOUTOUT_COOLDOWN);
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
      `Raid received by ${event.userName} | WaitingList: ${TwitchClient.raidersIdWaiting}`,
    );
    if (
      TwitchClient.shoutedOutIds.has(event.userId) ||
      TwitchClient.raidersIdWaiting.includes(event.userId)
    ) {
      log("Already raided the channel during this stream");
      return;
    }

    // No shoutout yet or cooldown finished
    if (
      !TwitchClient.lastShoutout ||
      Date.now() - TwitchClient.lastShoutout > TwitchClient.SHOUTOUT_COOLDOWN
    ) {
      TwitchClient.shoutedOutIds.add(event.userId);
      TwitchClient.lastShoutout = Date.now();
      this.shoutout(event.userId);
      return;
    }

    const timeSinceLastShoutout = Date.now() - TwitchClient.lastShoutout;
    TwitchClient.raidersIdWaiting.push(event.userId);
    setTimeout(
      this.futureShoutout,
      TwitchClient.SHOUTOUT_COOLDOWN - timeSinceLastShoutout,
    );
  }
}
