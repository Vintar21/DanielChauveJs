import {
  ApiClient,
  HelixBitsApi,
  HelixChannelApi,
  HelixChannelPointsApi,
  HelixCharityApi,
  HelixChatApi,
  HelixClipApi,
  HelixGame,
  HelixGameApi,
  HelixGoalApi,
  HelixHypeTrainApi,
  HelixModerationApi,
  HelixPollApi,
  HelixPredictionApi,
  HelixStream,
  HelixStreamApi,
  HelixSubscriptionApi,
  HelixUser,
  HelixUserApi,
} from "@twurple/api";
import { ChatClient, ChatMessage } from "@twurple/chat";
import { Bot } from "@twurple/easy-bot";
import ChannelPointsListener from "../channel-points-rewards/ChannelPointsListener";
import CommandsManager from "../commands/CommandsManager";
import { channel } from "../config/ConfigLoader";
import CountersManager from "../counters/CountersManager";
import TimerManager from "../timers/TimerManager";
import { Category } from "../utils/CategoriesConstants";
import { log, warn } from "../utils/CommonUtils";
import { EMPTY, SPACE } from "../utils/StringConstants";
import WatchStreakEvent from "./events/WatchStreakEvent";
import EventEmitter from "events";

export default abstract class ATwitchClient {
  protected static botApp: Bot;
  protected static broadcasterApp: Bot;
  protected static broadcaster: HelixUser;
  protected static bot: HelixUser;

  // Public for test purpose
  public static chatClient: ChatClient;

  private commandsManager: CommandsManager;
  static channelPointsListener: ChannelPointsListener;
  static timerManager: TimerManager = TimerManager.getInstanceAndInit();
  static countersManager: CountersManager;

  eventEmitter: EventEmitter = new EventEmitter();

  public abstract init(assignHandlers: boolean): Promise<void>;

  public createMarker(description?: string): Promise<boolean> {
    if (ATwitchClient.broadcaster) {
      return ATwitchClient.broadcaster.getStream().then((stream) => {
        if (ATwitchClient.broadcaster && stream && stream !== null) {
          this.getApi().streams.createStreamMarker(
            ATwitchClient.broadcaster?.id,
            description,
          );
          return true;
        }
        return false;
      });
    }
    return Promise.resolve(false);
  }

  // Listeners/Handlers
  public async shoutout(userId: string): Promise<void> {
    const currentStream = await this.getBroadcaster().getStream();
    if (!currentStream || currentStream === null || !currentStream.startDate) {
      const user = await this.getUsersApi().getUserById(userId);
      const username = user === null ? EMPTY : user.name;
      ATwitchClient.send(
        `Merci pour le raid ${username}${username === EMPTY ? EMPTY : SPACE}! Même si l'autre est pas en stream LUL`,
      );
      return;
    }
    return this.getChatApi().shoutoutUser(this.getBroadcasterId(), userId);
  }

  public async getTitle(): Promise<string> {
    return (
      await this.getChannelsApi().getChannelInfoById(this.getBroadcasterId())
    ).title;
  }

  public async setTitle(title: string): Promise<boolean> {
    if (title.length > 140) {
      warn(`Title not updated: given title was too long (> 140)`);
      return false;
    }

    return this.getChannelsApi()
      .updateChannelInfo(this.getBroadcasterId(), {
        title,
      })
      .then(() => true)
      .catch(() => false);
  }

  public static send(message: String, isAnnounce: boolean = false): void {
    if (isAnnounce) {
      ATwitchClient.botApp.announce(channel, message.toString());
    } else {
      ATwitchClient.botApp.say(channel, message.toString());
    }
  }

  public reply(message: String, chatMessage: ChatMessage): void {
    ATwitchClient.botApp.reply(channel, message.toString(), chatMessage);
  }

  public abstract onWatchStreakEvent(event: WatchStreakEvent): void;

  public initChatClient() {
    this.eventEmitter.on(WatchStreakEvent.TYPE, this.onWatchStreakEvent);

    ATwitchClient.chatClient.irc.onAnyMessage((msg) => {
      if (
        msg.rawLine.startsWith(":tmi.twitch.tv PONG tmi.twitch.tv") ||
        msg.rawLine.startsWith("PING :tmi.twitch.tv")
      )
        return;
      //log(`IRC raw line: ${msg.rawLine}`);
      const watchStreakMatch =
        /^.*?msg-param-category=watch-streak;.*?;msg-param-value=(\d+).*?tmi.twitch.tv(?:.*?#\S+\s:(.*))?/gi.exec(
          msg.rawLine,
        );

      if (watchStreakMatch && watchStreakMatch !== null) {
        const userIdMatch = /;user-id=(\d+);/gi.exec(msg.rawLine);
        const userId =
          !userIdMatch || userIdMatch === null
            ? undefined
            : Number(userIdMatch[1]);
        const watchStreak = Number(watchStreakMatch[1]);
        const watchStreakMessage =
          watchStreakMatch.length >= 3 ? watchStreakMatch[2] : undefined;
        log(`Watch streak: ${userIdMatch} = ${watchStreak}`);
        if (!isNaN(watchStreak) && userIdMatch && !isNaN(userId)) {
          const event = new WatchStreakEvent(
            userId,
            watchStreak,
            watchStreakMessage,
          );
          this.eventEmitter.emit(WatchStreakEvent.TYPE, event);
        }
      }
    });
  }

  //public onWatchStreakEvent()

  /*----- API calls -----*/

  // TODO better handling of error (maybe in the mainApp ?)
  public getApi(): ApiClient {
    if (!ATwitchClient.broadcasterApp) {
      throw Error("Bot isn't available, API couldn't be accessed");
    }
    return ATwitchClient.broadcasterApp?.api;
  }

  public getBitsApi(): HelixBitsApi {
    return this.getApi().bits;
  }

  public getChannelsApi(): HelixChannelApi {
    return this.getApi().channels;
  }

  public getCharityApi(): HelixCharityApi {
    return this.getApi().charity;
  }

  public getChatApi(): HelixChatApi {
    return this.getApi().chat;
  }

  public getChannelPointsApi(): HelixChannelPointsApi {
    return this.getApi().channelPoints;
  }

  public getClipApi(): HelixClipApi {
    return this.getApi().clips;
  }

  public getGamesApi(): HelixGameApi {
    return this.getApi().games;
  }

  public getGoalApi(): HelixGoalApi {
    return this.getApi().goals;
  }

  public getHypeTrainApi(): HelixHypeTrainApi {
    return this.getApi().hypeTrain;
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

  public getStreamsApi(): HelixStreamApi {
    return this.getApi().streams;
  }

  public getSubscriptionsApi(): HelixSubscriptionApi {
    return this.getApi().subscriptions;
  }

  public getUsersApi(): HelixUserApi {
    return this.getApi().users;
  }

  // Other getters

  public getBroadcaster(): HelixUser {
    return ATwitchClient.broadcaster;
  }

  public getBroadcasterId(): string {
    return this.getBroadcaster().id;
  }

  public getBot(): HelixUser {
    return ATwitchClient.bot;
  }

  public getBotId(): string {
    return this.getBot().id;
  }

  public getBroadcasterApp(): Bot {
    return ATwitchClient.broadcasterApp;
  }

  public getBotApp(): Bot {
    return ATwitchClient.botApp;
  }

  public getCommandsManager(): CommandsManager {
    return this.commandsManager;
  }

  // TODO fairte autrement nan ?
  public setCommandsManager(commandManager: CommandsManager) {
    this.commandsManager = commandManager;
  }

  public static getChannelPointsListener(): ChannelPointsListener {
    return ATwitchClient.channelPointsListener;
  }

  public static getTimerManager(): TimerManager {
    return ATwitchClient.timerManager;
  }

  public async getCurrentGame(): Promise<string | undefined> {
    return this.getChannelsApi()
      .getChannelInfoById(this.getBroadcasterId())
      .then((channel) => channel?.gameName);
  }

  public async setCurrentGame(game: Category): Promise<boolean> {
    const category: HelixGame = await this.getGamesApi().getGameByName(game);
    if (!category || category === null) {
      warn(`No category named ${game}`);
      return false;
    }

    this.getChannelsApi().updateChannelInfo(this.getBroadcasterId(), {
      gameId: category.id,
    });
    return true;
  }

  public async getCurrentStream(): Promise<HelixStream> {
    return this.getBroadcaster().getStream();
  }
}
