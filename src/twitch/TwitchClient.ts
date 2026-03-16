import {
  RefreshingAuthProvider,
  refreshUserToken,
  StaticAuthProvider,
} from "@twurple/auth";
import { ChatClient, ChatUser } from "@twurple/chat";
import { Bot, RaidEvent } from "@twurple/easy-bot";
import { EventSubAutoModMessageHoldV2Event } from "@twurple/eventsub-base";
import { EventSubStreamOnlineEvent } from "@twurple/eventsub-base/lib/events/EventSubStreamOnlineEvent";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { MainApp } from "../app";
import ChannelPointsListener from "../channel-points-rewards/ChannelPointsListener";
import { allCounterCommands } from "../commands/AllCommands";
import CommandsManager from "../commands/CommandsManager";
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
import { User } from "../utils/user/User";
import ATwitchClient from "./ATwitchClient";
import { filterMessage, onChatMessage } from "./TwitchEventHandlers";
import { getGreaterRole } from "../utils/RoleUtils";

export default class TwitchClient extends ATwitchClient {
  private static INSTANCE: TwitchClient;
  protected listener: EventSubWsListener;

  constructor() {
    super();
  }

  /* TODO
   * - Create a hierarchy to split this class
   * - Integrate more methods here like createPoll, getUserByName etc...
   * - Try to remove unnecessary use of static
   **/
  public static getInstanceAndInit(): TwitchClient {
    if (!TwitchClient.INSTANCE) {
      TwitchClient.INSTANCE = new TwitchClient();
      TwitchClient.INSTANCE.init(true);
    }

    return TwitchClient.INSTANCE;
  }

  public async init(assignHandlers: boolean = false): Promise<void> {
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

    ATwitchClient.broadcasterApp = new Bot({
      authProvider: broadcasterAuthProvider,
      channels: [channel],
    });

    // Authentication of botApp
    ATwitchClient.botApp = ATwitchClient.broadcasterApp;
    // TODO: modif in config to don't have the fallback twice
    if (botClientId && botAccessToken) {
      // TODO: Limit bot rights ? Just need to send message as broadcaster has all other rights ?
      const botAuthProvider: StaticAuthProvider = new StaticAuthProvider(
        botClientId,
        botAccessToken,
      );

      ATwitchClient.botApp = new Bot({
        authProvider: botAuthProvider,
        channels: [channel],
      });

      ATwitchClient.chatClient = new ChatClient({
        authProvider: botAuthProvider,
        channels: [channel],
      });
      ATwitchClient.chatClient.connect();
    }

    const _broadcaster = await this.getApi().users.getUserByName(channel);
    // Can't I get this automatically ?
    const _bot = await this.getApi().users.getUserByName("DanielChauve");

    if (_broadcaster === null || _bot === null) return;

    ATwitchClient.broadcaster = _broadcaster;
    ATwitchClient.bot = _bot;

    this.listener = new EventSubWsListener({
      apiClient: this.getApi(),
    });
    this.listener.start();

    // ChannelPointListener
    ATwitchClient.channelPointsListener =
      await ChannelPointsListener.getInstanceAndInit(this, this.listener);

    // TwitchCommandsManager
    this.setCommandsManager(CommandsManager.getInstance());
    await this.getCommandsManager().init();

    // TimerManager
    ATwitchClient.timerManager = TimerManager.getInstanceAndInit();
    ATwitchClient.timerManager.startAllTimers();

    // CountersManager
    ATwitchClient.countersManager = CountersManager.initAllCounters();
    allCounterCommands.forEach((command) => command.initCountersMapIfEmpty());

    if (assignHandlers) {
      // TODO not onMessage but onChatMessage...
      // + TwitchEventHandler may not be sufficient do it directly in this client

      ATwitchClient.chatClient.onMessage(onChatMessage);

      //ATwitchClient.botApp.onMessage(onMessage);
      /*this.listener.onChannelChatMessage(
        this.getBroadcaster(),
        this.getBroadcasterId(),
        this.onChatMessage,
      );*/
      ATwitchClient.botApp.onRaid(this.onRaid);

      this.listener.onStreamOnline(
        this.getBroadcasterId(),
        this.onStreamOnline,
      );

      // TODO: use Daniel account as second param (no token found ? => intents ?)
      this.listener.onAutoModMessageHoldV2(
        this.getBroadcasterId(),
        this.getBroadcasterId(),
        this.onMessageHeld,
      );
    }

    // Watch streak listener through IRC
    ATwitchClient.chatClient.irc.onAnyMessage(async (msg) => {
      const matchResult = msg.rawLine.match(
        /msg-param-category=watch-streak;.*;msg-param-value=(\d+)/gi,
      );

      if (matchResult && matchResult !== null) {
        // remove the #
        const username = msg.rawParamValues[0].slice(1);
        const user = await this.getUsersApi().getUserByName(username);
        const watchStreak = Number(matchResult[1]);
        log(`Watch streak: ${username} = ${matchResult[1]}`);
      }
    });
    log("Twitch Client ready !");
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
      TwitchClient.INSTANCE.shoutout(event.userId);
      return;
    }

    const timeSinceLastShoutout = Date.now() - TwitchClient.lastShoutout;
    TwitchClient.raidersIdWaiting.push(event.userId);
    setTimeout(
      TwitchClient.INSTANCE.futureShoutout,
      TwitchClient.SHOUTOUT_COOLDOWN - timeSinceLastShoutout,
    );
  }

  private async onStreamOnline(event: EventSubStreamOnlineEvent) {
    log("Stream Online !");
    if (!MainApp.obsManager.isReady()) {
      await MainApp.obsManager.connect();
    }
    // In fact, no need to reaffect CommandManager => ERROR here
    this.setCommandsManager(CommandsManager.getInstance());
    await this.getCommandsManager().init();
    TwitchClient.raidersIdWaiting = [];
    TwitchClient.shoutedOutIds.clear();

    //const broadcaster = MainApp.getBroadcaster();
    var stream = await event.getStream();
    if (stream === null) {
      log("No current stream via twitch API");
      setTimeout(async () => {
        log("Try resending live announce");
        MainApp.discordClient.sendLiveAnounce(
          await ATwitchClient.broadcaster.getStream(),
          ATwitchClient.broadcaster,
        );
      }, minutes(1));
    } else {
      log("Sending live announce directly");
      MainApp.discordClient.sendLiveAnounce(stream, ATwitchClient.broadcaster);
    }
    ATwitchClient.send(
      "Je suis toujours en phase de test, n'hésitez pas à me mettre à l'épreuve !",
    );
  }

  // Not working
  private async onMessageHeld(
    event: EventSubAutoModMessageHoldV2Event,
  ): Promise<void> {
    const user = new User(
      event.userName,
      Number(event.userId),
      await getGreaterRole(event.getUser()),
    );
    filterMessage(event.messageText, user);
  }
}
