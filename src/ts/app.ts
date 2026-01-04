const optionJson = require("../../package.json");
const username = optionJson.username;
const password = optionJson.password;
const channel = optionJson.channel;

var tmi = require("tmi.js");

import { commandPrefix } from "./command";
import Command from "./command";

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
  channel,
};

// TODO make a client utils or something + a reply function to reply directly to message
export function send(message: string) {
  client.say(channel, message);
}

export function reply(message: string, msgId: string) {
  client.reply(channel, message, msgId);
}

var commands = new Set<Command>();
var salutCommand = new Command(["salut", "bonjour"], "Salut !");
//salutCommand.setGlobalCooldown(2);
//salutCommand.setUserCooldown(60);
salutCommand.setMaxUsePerUser(2);

commands.add(salutCommand);

var client = new tmi.client(options);
client.connect();

client.on(
  "chat",
  function (channel: any, userstate: any, message: any, self: any) {
    const username: string = userstate.username;
    const userId: number = userstate["user-id"];
    const msgId: string = userstate.id;

    // Works for simple commands
    // TODO: stop at first match (priority)
    // TODO: more complex commands
    if (message.charAt(0) == commandPrefix) {
      var parts = message.toLowerCase().split(" ");
      commands.forEach((command) => {
        if (command.isTriggeredBy(parts[0].substring(1))) {
          command.answer(userId, msgId);
        }
      });
    }
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
