const CONFIGS_FOLDER = "../../configs/";

// Twitch
const twitchConfig = loadSpecificConfig("Twitch");
export const broadcasterId = twitchConfig["twitch-broadcaster-id"];
export const broadcasterClientId = twitchConfig["broadcaster-client-id"];
export const broadCasterAccessToken = twitchConfig["broadcaster-access-token"];
export const botId = twitchConfig["twitch-bot-id"] ?? broadcasterId;
export const botClientId = twitchConfig["bot-client-id"] ?? broadcasterClientId;
export const botAccessToken =
  twitchConfig["bot-access-token"] ?? broadCasterAccessToken;
export const channel = twitchConfig.channel;

// Links
const linksConfig = loadSpecificConfig("Links");

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
const obsConfig = loadSpecificConfig("Obs");
const obsWebSocket = obsConfig["obs-websocket"] ?? undefined;
export const obsLightTesting = obsConfig["obs-light-testing"] ?? undefined;
export const obsWebSocketUrl = obsConfig ? `ws://${obsWebSocket.address}:${obsWebSocket.port}` : undefined;
export const obsWebSocketPassword = obsWebSocket.password ?? undefined;

// Sql
const sqlConfig = loadSpecificConfig("Sql");
export const sqlLightTesting = sqlConfig["sql-light-testing"] ?? undefined;
const sqlServer = sqlConfig["sql-server"]  ?? undefined;
export const sqlConnectionString = sqlConfig ? `Driver={${sqlServer.driver}}; Server=${sqlServer.server}; Database=${sqlServer.database};Trusted_Connection=${sqlServer["trusted-connection"]};TrustServerCertificate=${sqlServer["trust-server-certificate"]};` : undefined;

// Discord
const discordConfig = loadSpecificConfig("Discord");
export const discordServerId = discordConfig["server-id"] ?? undefined;
export const discordToken = discordConfig.token ?? undefined;
export const cron = discordConfig.cron ?? undefined;
export const discordChannelId = discordConfig["channel-id"] ?? undefined ;
export const discordRoleId = discordConfig["role-id"] ?? undefined;

function loadSpecificConfig(configKind: string): any {
  const jsonFile = `config${configKind}.json`;
  const localConfig = require(CONFIGS_FOLDER + jsonFile) ?? undefined;
  if (!localConfig) {
    console.warn(`config${jsonFile}.json can't be found, ${configKind} features will not be available`);
  }
  return localConfig;
}