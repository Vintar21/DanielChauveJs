import { StaticAuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import { MessageEvent } from "@twurple/easy-bot/lib";
import ChannelPointsListener from "./channel-points-rewards/ChannelPointsListener";
import CommandsManager from "./commands/CommandsManager";
import User from "./user/User";
import { accessToken, channel, clientId } from "./utils/ImportConstants.js";
import { getGreaterRole } from "./utils/RoleUtils";

const authProvider: StaticAuthProvider = new StaticAuthProvider(
  clientId,
  accessToken,
);
export const bot: Bot = new Bot({ authProvider, channels: [channel] });
const promisedBroadcaster = bot.api.users.getUserByName(channel);

const commandsManager: CommandsManager = CommandsManager.getInstanceAndInit();

bot.onMessage((event) => {
  const message: string = event.text;
  const username: string = event.userName;
  // Do we really need it to be a number ?
  const userId: number = parseInt(event.userId);

  console.log(`Message received from [${userId}] ${username}: ${message}`);
  const user = new User(username, userId);

  //username = "Moobot";
  //userId = 1564983;
  // TODO: more complex commands
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

ChannelPointsListener.getInstance(bot, promisedBroadcaster).init();

export function send(message: string) {
  bot.say(channel, message);
}

export function reply(message: string, event: MessageEvent) {
  // use bot.reply instead ? How ?
  event.reply(message);
}
