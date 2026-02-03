export const _ = require("lodash");
export const tmi = require("tmi.js");

// Parsing Json
const optionJson = require("../../package.json");
export const username = optionJson.username;
export const password = optionJson.password;
const channels = optionJson.channels;
export const channel = channels[0];
const obsWebSocket = optionJson["obs-websocket"];
export const obsWebSocketUrl = `ws://${obsWebSocket.address}:${obsWebSocket.port}`;
export const obsWebSocketPassword = obsWebSocket.password;
const sqlServer = optionJson["sql-server"];
export const sqlConnectionString = `Driver={ODBC Driver 18 for SQL Server}; Server=${sqlServer.server}; Database=${sqlServer.database};Trusted_Connection=yes;TrustServerCertificate=yes;`;

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
