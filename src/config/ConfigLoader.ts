import fs from "fs";

const CONFIGS_FOLDER = "../../configs/";

// Twitch
const twitchConfig = loadSpecificConfig("Twitch");
export const broadcasterClientId = twitchConfig["broadcaster-client-id"];
export const broadcasterClientSecret = twitchConfig["broadcaster-secret"];
export const broadcasterRefreshToken =
  twitchConfig["broadcaster-refresh-token"];
// If no bot ID/tokens => we will take the broadcaster's ones
export const botClientId = twitchConfig["bot-client-id"];
export const botAccessToken = twitchConfig["bot-access-token"];
export const channel = twitchConfig.channel;

// Links
const linksConfig = loadSpecificConfig("Links");

export const commandsManualLink =
  linksConfig["commands-manual-link"] ?? undefined;

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
export const obsWebSocketUrl = obsConfig
  ? `ws://${obsWebSocket.address}:${obsWebSocket.port}`
  : undefined;
export const obsWebSocketPassword = obsWebSocket.password ?? undefined;

// Sql
const sqlConfig = loadSpecificConfig("Sql");
export const sqlLightTesting = sqlConfig["sql-light-testing"] ?? undefined;
const sqlServer = sqlConfig["sql-server"] ?? undefined;
export const sqlConnectionString = sqlConfig
  ? `Driver={${sqlServer.driver}}; Server=${sqlServer.server}; Database=${sqlServer.database};Trusted_Connection=${sqlServer["trusted-connection"]};TrustServerCertificate=${sqlServer["trust-server-certificate"]};`
  : undefined;

// Google
const googleConfig = loadSpecificConfig("Google");
export const googleApiMail = googleConfig.client_email;
export const googlePrivateKey = googleConfig.private_key;
export const googleSpreadSheetId = googleConfig.spreadsheet_id;

// Discord
const discordConfig = loadSpecificConfig("Discord");
export const discordServerId = discordConfig["server-id"] ?? undefined;
export const discordToken = discordConfig.token ?? undefined;
export const cron = discordConfig.cron ?? undefined;
export const discordAnnounceChannelId = discordConfig?.testing
  ? discordConfig["channel-id-test"]
  : (discordConfig["live-announce-channel-id"] ?? undefined);
export const discordPollsChannelId = discordConfig?.testing
  ? discordConfig["channel-id-test"]
  : (discordConfig["poll-channel-id"] ?? undefined);
export const discordCommandsChannelId =
  discordConfig["commands-channel-id"] ?? undefined;
export const discordRoleId = discordConfig["role-id"] ?? undefined;

export const discordServerIdBg3 = discordConfig["server-id-bg3"] ?? undefined;
export const discordChannelIdBg3 = discordConfig["channel-id-bg3"] ?? undefined;

function loadSpecificConfig(configKind: string): any {
  const jsonFile = `config${configKind}.json`;
  const configPath = CONFIGS_FOLDER + jsonFile;

  // Assuming you run the bot from the root folder
  if (!fs.existsSync("./configs/" + jsonFile)) {
    console.warn(
      `${configPath} can't be found, ${configKind} features will not be available`,
    );
    return undefined;
  }
  return require(configPath);
}
