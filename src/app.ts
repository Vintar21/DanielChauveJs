import { StaticAuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import { MessageEvent } from "@twurple/easy-bot/lib";
import ChannelPointsListener from "./channel-points-rewards/ChannelPointsListener";
import CommandsManager from "./commands/CommandsManager";
import { rollCommand } from "./commands/misc/AllMiscCommands";
import {
  botAccessToken,
  botClientId,
  broadCasterAccessToken,
  broadcasterClientId,
  channel,
  obsLightTesting,
  sqlLightTesting,
} from "./config/ConfigLoader";
import DiscordClient from "./discord/DiscordClient";
import TimerManager from "./timers/TimerManager";
import User from "./user/User";
import { getGreaterRole } from "./utils/RoleUtils";

export const canUseSqlBase: boolean = !sqlLightTesting;
export const canUseObsWebsocket: boolean = !obsLightTesting;

const broadcasterAuthProvider: StaticAuthProvider = new StaticAuthProvider(
  broadcasterClientId,
  broadCasterAccessToken,
);
export const broadcasterApp: Bot = new Bot({
  authProvider: broadcasterAuthProvider,
  channels: [channel],
});

const botAuthProvider: StaticAuthProvider = new StaticAuthProvider(
  botClientId,
  botAccessToken,
);
export const botApp: Bot = new Bot({
  authProvider: botAuthProvider,
  channels: [channel],
});

const discordClient: DiscordClient = new DiscordClient();
discordClient.start();
const commandsManager: CommandsManager = CommandsManager.getInstanceAndInit();
const channelPointsListener: ChannelPointsListener =
  ChannelPointsListener.getInstanceAndInit(broadcasterApp);
const timerManager: TimerManager = TimerManager.getInstanceAndInit();
timerManager.startAllTimers();

rollCommand.resetMvp();

console.log("### Bot started ###");

botApp.onMessage((event) => {
  const message: string = event.text;
  const username: string = event.userName;
  // Do we really need it to be a number ?
  const userId: number = parseInt(event.userId);

  console.log(`Message received from [${userId}] ${username}: ${message}`);
  timerManager.updateAllTimersOnMessage();
  const user = new User(username, userId);

  var triggeredCommand = commandsManager.getTriggeredCommand(message);
  triggeredCommand
    ?.canExecute(user, getGreaterRole(event.getUser(), broadcasterApp))
    .then((canExecute) => {
      if (canExecute) {
        triggeredCommand.execute(user, event);
      }
    });
});

export function send(message: String) {
  botApp.say(channel, message.toString());
}

export function reply(message: String, event: MessageEvent) {
  // use bot.reply instead ? How ?
  event.reply(message.toString());
}
