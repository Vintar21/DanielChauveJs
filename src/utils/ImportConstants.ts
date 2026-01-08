export const _ = require("lodash");
export const tmi = require("tmi.js");

// Parsing Json
const optionJson = require("../../package.json");
export const username = optionJson.username;
export const password = optionJson.password;
const channels = optionJson.channels;
export const channel = channels[0];
const obsWebSocketAddress = optionJson["obs-websocket-address"];
const obsWebSocketPort = optionJson["obs-websocket-port"];
export const obsWebSocketUrl = `ws://${obsWebSocketAddress}:${obsWebSocketPort}`;
export const obsWebSocketPassword = optionJson["obs-websocket-password"];

export const options = {
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
