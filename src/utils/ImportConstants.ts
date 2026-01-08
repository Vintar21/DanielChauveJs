export const _ = require("lodash");
export const tmi = require("tmi.js");

// Parsing Json
const optionJson = require("../../package.json");
export const username = optionJson.username;
export const password = optionJson.password;
export const channels = optionJson.channels;
export const channel = channels[0];

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
