import {
  ApiClient,
  HelixBitsApi,
  HelixChannelApi,
  HelixChannelPointsApi,
  HelixCharityApi,
  HelixChatApi,
  HelixClipApi,
  HelixGameApi,
  HelixGoalApi,
  HelixHypeTrainApi,
  HelixModerationApi,
  HelixPollApi,
  HelixPredictionApi,
  HelixStream,
  HelixUser,
  HelixUserApi,
} from "@twurple/api";
import { Bot, MessageEvent } from "@twurple/easy-bot";
import ChannelPointsListener from "../channel-points-rewards/ChannelPointsListener";
import CommandsManager from "../commands/CommandsManager";
import { channel } from "../config/ConfigLoader";
import CountersManager from "../counters/CountersManager";
import TimerManager from "../timers/TimerManager";
import { EMPTY, SPACE } from "../utils/StringConstants";

export default abstract class ATwitchClient {
  protected static botApp: Bot;
  protected static broadcasterApp: Bot;
  protected static broadcaster: HelixUser;

  static commandsManager: CommandsManager;
  static channelPointsListener: ChannelPointsListener;
  static timerManager: TimerManager = TimerManager.getInstanceAndInit();
  static countersManager: CountersManager;

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

  public static send(message: String, isAnnounce: boolean = false): void {
    if (isAnnounce) {
      ATwitchClient.botApp.announce(channel, message.toString());
    } else {
      ATwitchClient.botApp.say(channel, message.toString());
    }
  }

  public reply(message: String, event: MessageEvent): void {
    // use bot.reply instead ? How ?
    event.reply(message.toString());
  }

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

  public getUsersApi(): HelixUserApi {
    return this.getApi().users;
  }

  public getBroadcaster(): HelixUser {
    return ATwitchClient.broadcaster;
  }

  public getBroadcasterId(): string {
    return this.getBroadcaster().id;
  }

  public getBroadcasterApp(): Bot {
    return ATwitchClient.broadcasterApp;
  }

  public static getCommandsManager(): CommandsManager {
    return ATwitchClient.commandsManager;
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

  public async getCurrentStream(): Promise<HelixStream> {
    return this.getBroadcaster().getStream();
  }
}
