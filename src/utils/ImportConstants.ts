export const _ = require("lodash");

// Parsing Json
const optionJson = require("../../package.json");
export const username = optionJson.username;
export const clientId = optionJson["client-id"];
export const password = optionJson.password;
export const accessToken = optionJson["access-token"];
const channels = optionJson.channels;
export const channel = channels[0];
const obsWebSocket = optionJson["obs-websocket"];
export const obsWebSocketUrl = `ws://${obsWebSocket.address}:${obsWebSocket.port}`;
export const obsWebSocketPassword = obsWebSocket.password;
const sqlServer = optionJson["sql-server"];
export const sqlConnectionString = `Driver={ODBC Driver 18 for SQL Server}; Server=${sqlServer.server}; Database=${sqlServer.database};Trusted_Connection=yes;TrustServerCertificate=yes;`;
const socialMedias = optionJson["social-media-links"];
export const discordLink = socialMedias.discord;
export const youtubeLink = socialMedias.youtube;
export const instagramLink = socialMedias.instagram;
export const blueskyLink = socialMedias.bluesky;
// Light testing doesn't use any external ressource like SQL base or OBS websocket
export const lightTesting: boolean = optionJson["light-testing"];

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
