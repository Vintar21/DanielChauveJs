const CONFIGS_FOLDER = "../../configs/";

// Twitch
const twitchConfig = require(CONFIGS_FOLDER + "configTwitch.json");
export const username = twitchConfig.username;
export const clientId = twitchConfig["client-id"];
export const accessToken = twitchConfig["access-token"];
const channels = twitchConfig.channels;
export const channel = channels[0];

// Links
const linksConfig = require(CONFIGS_FOLDER + "configLinks.json") ?? undefined;
//-- social medias
const socialMedias = linksConfig["social-media-links"] ?? undefined;
export const discordLink = socialMedias.discord ?? undefined;
export const youtubeLink = socialMedias.youtube ?? undefined;
export const instagramLink = socialMedias.instagram ?? undefined;
export const blueskyLink = socialMedias.bluesky ?? undefined;
export const rankoneLink = socialMedias.rankone ?? undefined;
export const speedrunComLink = socialMedias["speedrun.com"] ?? undefined;
export const gitLink = socialMedias.github ?? undefined;
export const switchFriendCode = socialMedias["switch-friend-code"] ?? undefined;

//-- clips
const clips = linksConfig.clips ?? undefined;
export const chaiseClip = clips.chaise ?? undefined;
export const pbCelesteVOD = clips["pb-celeste"] ?? undefined;

//-- other Links
const otherLinks = linksConfig["other-links"] ?? undefined;
export const docRollLink = otherLinks["docroll-sheet"] ?? undefined;
export const tutosCelestePlaylist = otherLinks["tutos-celeste"] ?? undefined;

// OBS
const obsConfig = require(CONFIGS_FOLDER + "configObs.json") ?? undefined;
const obsWebSocket = obsConfig["obs-websocket"] ?? undefined;
export const obsLightTesting = obsConfig["obs-light-testing"] ?? undefined;
export const obsWebSocketUrl = obsConfig ? `ws://${obsWebSocket.address}:${obsWebSocket.port}` : undefined;
export const obsWebSocketPassword = obsWebSocket.password ?? undefined;

// Sql
const sqlConfig = require(CONFIGS_FOLDER + "configSql.json") ?? undefined;
export const sqlLightTesting = sqlConfig["sql-light-testing"] ?? undefined;
const sqlServer = sqlConfig["sql-server"]  ?? undefined;
export const sqlConnectionString = sqlConfig ? `Driver={${sqlServer.driver}}; Server=${sqlServer.server}; Database=${sqlServer.database};Trusted_Connection=${sqlServer["trusted-connection"]};TrustServerCertificate=${sqlServer["trust-server-certificate"]};` : undefined;
