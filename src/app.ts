import { StaticAuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import { MessageEvent } from "@twurple/easy-bot/lib";
import ChannelPointsListener from "./channel-points-rewards/ChannelPointsListener";
import CommandsManager from "./commands/CommandsManager";
import User from "./user/User";
import {
  accessToken,
  channel,
  clientId,
  obsLightTesting,
  sqlLightTesting,
} from "./config/ConfigLoader";

import { getGreaterRole } from "./utils/RoleUtils";
import TimerManager from "./timers/TimerManager";
import { rollCommand } from "./commands/misc/AllMiscCommands";

export const canUseSqlBase: boolean = !sqlLightTesting;
export const canUseObsWebsocket: boolean = !obsLightTesting;

const authProvider: StaticAuthProvider = new StaticAuthProvider(
  clientId,
  accessToken,
);
export const bot: Bot = new Bot({ authProvider, channels: [channel] });
const promisedBroadcaster = bot.api.users.getUserByName(channel);

const commandsManager: CommandsManager = CommandsManager.getInstanceAndInit();
const channelPointsListener: ChannelPointsListener =
  ChannelPointsListener.getInstanceAndInit(bot, promisedBroadcaster);
const timerManager: TimerManager = TimerManager.getInstanceAndInit();
timerManager.startAllTimers();

rollCommand.resetMvp();

console.log("### Bot started ###");

bot.onMessage((event) => {
  const message: string = event.text;
  const username: string = event.userName;
  // Do we really need it to be a number ?
  const userId: number = parseInt(event.userId);

  console.log(`Message received from [${userId}] ${username}: ${message}`);
  timerManager.updateAllTimersOnMessage();
  const user = new User(username, userId);

  var triggeredCommand = commandsManager.getTriggeredCommand(message);
  triggeredCommand
    ?.canExecute(
      user,
      getGreaterRole(event.getUser(), promisedBroadcaster, bot),
    )
    .then((canExecute) => {
      if (canExecute) {
        triggeredCommand.execute(user, event);
      }
    });
});

export function send(message: String) {
  bot.say(channel, message.toString());
}

export function reply(message: String, event: MessageEvent) {
  // use bot.reply instead ? How ?
  event.reply(message.toString());
}
