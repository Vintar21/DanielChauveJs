import { StaticAuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import SimpleCommand from "./commands/SimpleCommand";
import RollCommand from "./commands/RollCommand";
import ICommand from "./commands/ICommand";
import { getGreaterRole, Roles } from "./utils/RoleUtils";
import { SPACE } from "./utils/StringConstants";
import User from "./user/User";
import { channel, clientId, accessToken } from "./utils/ImportConstants.js";
import CommandOptions from "./commands/CommandOptions";
import { MessageEvent } from "@twurple/easy-bot/lib";
import ChannelPointsListener from "./channel-points-rewards/ChannelPointsListener";

const authProvider: StaticAuthProvider = new StaticAuthProvider(
  clientId,
  accessToken,
);
const bot: Bot = new Bot({ authProvider, channels: [channel] });
const promisedBroadcaster = bot.api.users.getUserByName(channel);

var commands = new Array<ICommand>();
const helloOptions: CommandOptions = new CommandOptions()
  .addTriggers([
    /s+a*l+u*t+/i,
    /bo*n*jo*u*r+/i,
    /yo+/i,
    /we*sh/i,
    /co*u*co*u*/i,
    /he+l{2,}o+/,
  ])
  .setMaxUsePerUser(1)
  .setByPassRole(Roles.BROADCASTER)
  .setUnallowedRole(Roles.NO_ROLE);
const helloCommand: SimpleCommand = new SimpleCommand(
  helloOptions,
  "Salut le sang de la veine de l'artère aorte !",
);

// Order matters !!
commands.push(helloCommand);
commands.push(RollCommand.getInstance());

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
  var parts = message.toLowerCase().split(SPACE);
  var triggeredCommand = commands.find((command) => {
    return command.match(parts[0]);
  });
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
