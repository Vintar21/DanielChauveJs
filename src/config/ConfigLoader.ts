// Twitch
const twitchConfig = require("../../configs/configTwitch.json");
export const username = twitchConfig.username;
export const clientId = twitchConfig["client-id"];
export const accessToken = twitchConfig["access-token"];
const channels = twitchConfig.channels;
export const channel = channels[0];

// Links
const linksConfig = require("../../configs/configLinks.json");
//-- social medias
const socialMedias = linksConfig["social-media-links"];
export const discordLink = socialMedias.discord;
export const youtubeLink = socialMedias.youtube;
export const instagramLink = socialMedias.instagram;
export const blueskyLink = socialMedias.bluesky;
export const rankoneLink = socialMedias.rankone;
export const speedrunComLink = socialMedias["speedrun.com"];
export const gitLink = socialMedias.github;

//-- clips
const clips = linksConfig.clips;
export const chaiseClip = clips.chaise;
export const pbCelesteVOD = clips["pb-celeste"];

//-- other Links
const otherLinks = linksConfig["other-links"];
export const docRollLink = otherLinks["docroll-sheet"];
export const tutosCelestePlaylist = otherLinks["tutos-celeste"];

// OBS
const obsConfig = require("../../configs/configObs.json");
const obsWebSocket = obsConfig["obs-websocket"];
export const obsLightTesting = obsConfig["obs-light-testing"];
export const obsWebSocketUrl = `ws://${obsWebSocket.address}:${obsWebSocket.port}`;
export const obsWebSocketPassword = obsWebSocket.password;

// Sql
const sqlConfig = require("../../configs/configSql.json");
export const sqlLightTesting = sqlConfig["sql-light-testing"];
const sqlServer = sqlConfig["sql-server"];
export const sqlConnectionString = `Driver={${sqlServer.driver}}; Server=${sqlServer.server}; Database=${sqlServer.database};Trusted_Connection=${sqlServer["trusted-connection"]};TrustServerCertificate=${sqlServer["trust-server-certificate"]};`;
