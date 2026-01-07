const optionJson = require("../package.json");
const username = optionJson.username;
const password = optionJson.password;
const channels = optionJson.channels;
const channel = channels[0];

var tmi = require("tmi.js");

import Command from "./commands/Command";
import CommandBuilder from "./commands/CommandBuilder";
import { getGreaterRole, isFollower, Roles } from "./utils/RoleUtils";

var options = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username,
    password,
  },
  channels,
};

export function send(message: string) {
  client.say(channel, message);
}

export function reply(message: string, msgId: string) {
  client.reply(channel, message, msgId);
}

var commands = new Array<Command>();
const commandBuilder: CommandBuilder = new CommandBuilder();
const helloCommand: Command = commandBuilder
  .addTriggers(["salut", "BoNjoUr", "yo", "wesh", "slt", "bjr"])
  .setResponse("Salut BG!")
  .canReplyToUser()
  .setMaxUsePerUser(1)
  .setUnallowedRole(Roles.NO_ROLE)
  .build();
// Order matters !!
commands.push(helloCommand);

var client = new tmi.client(options);
client.connect();

client.on(
  "chat",
  function (channel: any, userstate: any, message: any, self: any) {
    var username: string = userstate.username;
    var userId: number = userstate["user-id"];
    const msgId: string = userstate.id;
    const channelId: number = userstate["room-id"];

    //username = "Moobot";
    //userId = 1564983;

    // TODO: more complex commands
    var parts = message.toLowerCase().split(" ");
    var triggeredCommand = commands.find((command) => command.match(parts[0]));
    triggeredCommand
      ?.canExecute(userId, getGreaterRole(userstate))
      .then((canExecute) => {
        if (canExecute) {
          triggeredCommand.execute(userId, msgId);
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
