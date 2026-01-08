import SimpleCommand from "./commands/SimpleCommand";
import RollCommand from "./commands/RollCommand";
import ICommand from "./commands/ICommand";
import { getGreaterRole, Roles } from "./utils/RoleUtils";
import { SPACE } from "./utils/StringConstants";
import User from "./user/User";
import {
  tmi,
  channel,
  options,
  username,
  password,
} from "./utils/ImportConstants";
import CommandOptions from "./commands/CommandOptions";

export function send(message: string) {
  client.say(channel, message);
}

export function reply(message: string, msgId: string) {
  client.reply(channel, message, msgId);
}

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
  "Salut le sang de la veine de l'artère aorte !"
);

// Order matters !!
commands.push(helloCommand);
commands.push(RollCommand.getInstance());

var client = new tmi.client(options);
client.connect();

client.on(
  "chat",
  function (channel: any, userstate: any, message: any, self: any) {
    var username: string = userstate.username;
    var userId: number = userstate["user-id"];
    const msgId: string = userstate.id;
    const channelId: number = userstate["room-id"];

    const user = new User(username, userId);

    //username = "Moobot";
    //userId = 1564983;

    // TODO: more complex commands
    var parts = message.toLowerCase().split(SPACE);
    var triggeredCommand = commands.find((command) => {
      return command.match(parts[0]);
    });
    triggeredCommand
      ?.canExecute(user, getGreaterRole(userstate))
      .then((canExecute) => {
        if (canExecute) {
          triggeredCommand.execute(user, msgId);
        }
      });
  }
);

client.on(
  "raided",
  function (raiderChannel: any, raiderUsername: any, viewers: any, tags: any) {
    // send(`vintarSTP vintarSTP vintarSTP vintarSTP vintarSTP`);
  }
);

client.on(
  "subgift",
  function (
    subChannel: any,
    subUsername: any,
    streakMonths: any,
    recipient: any,
    methods: any,
    tags: any
  ) {
    /*console.log(recipient)
    console.log(subUsername)
    if (recipient === "Moobot") {
        send(`!merci @${subUsername}`);
    }*/
  }
);

client.on(
  "redeem",
  function (
    channel: any,
    username: any,
    rewardtype: any,
    tags: any,
    cleanedMsg: any
  ) {
    /*if(rewardtype === "1b6beeec-c5ab-4ebe-9247-07fd4c6b3c64") {
        addBonus(username, 50)
        console.log("+50 amitié")
    }*/
  }
);

// client.on("sub", function(subChannel, subUsername, streakMonths, message, tags, methods){
//     send("vintarFraise vintarFraise vintarFraise vintarFraise vintarFraise");
// });

// client.on("resub", function(subChannel, subUsername, methods, message, tags){
//     send("vintarFraise vintarFraise vintarFraise vintarFraise vintarFraise");
// });
