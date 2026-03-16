import { EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js";
import { channel, discordCommandsChannelId } from "../config/ConfigLoader";
import { Permissions } from "../utils/permissions/Permissions";
import { Role, Roles } from "../utils/RoleUtils";
import {
  NEW_LINE,
  SLASH,
  TWITCH_CHANNEL_PREFIX,
} from "../utils/StringConstants";

export const DISCORD_COMMAND_PREFIX = SLASH;
export const TWITCH_ARGUMENT = "twitch";

export const CATEGORY_PLACEHOLDER = "%category%";
export const TITLE_PLACEHOLDER = "%title%";
export const THUMBNAIL_PLACEHOLDER = "%thumbnail%";
export const STARTED_AT_PLACEHOLDER = "%startedAt%";

export const DEFAULT_MESSAGE =
  "Mais nan un stream incroyable sur " +
  CATEGORY_PLACEHOLDER +
  " !!!" +
  NEW_LINE +
  "Mieux vaut ne pas louper ça !";

export const TAG_EVERYONE = "@everyone";

export const TWITCH_LINK = TWITCH_CHANNEL_PREFIX + channel;

export const twitchEmbedTemplate = new EmbedBuilder()
  .setColor(0x0099ff)
  .setURL(TWITCH_LINK)
  .setImage(
    `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-640x360.jpg?cacheBypass=${Math.random().toString()}`,
  )
  .setTimestamp();

export type DiscordMessage = OmitPartialGroupDMChannel<Message<boolean>>;
export type ServerId = string;
export type ChannelId = string;

// Allow every server
export function getDefaultServerPermissions(): Permissions<ServerId> {
  const defaultServerPermissions: Permissions<ServerId> = new Permissions();
  defaultServerPermissions.allowDefault();
  return defaultServerPermissions;
}

// The given commandChannelId can ByPass, others are just allowed
export function getDefaultChannelPermissions(): Permissions<ChannelId> {
  const defaultChannelPermissions: Permissions<ChannelId> = new Permissions();
  defaultChannelPermissions.allowDefault();
  defaultChannelPermissions.bypass(discordCommandsChannelId);
  return defaultChannelPermissions;
}

const OWNER = "974801540202250282";
const MODERATOR = "974801661551849552";
const VIP = "974801727289192468";
const STREAMER = "1077627595924983828";
const SUB = "974807385338155138";
const SUB_T1 = "974807385338155139";
const SUB_T2 = "974807385338155140";
const SUB_T3 = "974807385820504104";

const BROADCASTER_ROLES: string[] = [OWNER];
const MOD_ROLES: string[] = [MODERATOR, "1195055132954591323"];
const VIP_ROLES: string[] = [VIP, "1175066756415500480"];
const STREAMER_ROLES: string[] = [STREAMER];
const SUB_ROLES: string[] = [SUB, SUB_T1, SUB_T2, SUB_T3];
const MEMBER_ROLES: string[] = ["1020721967868940359"];
const BOT_ROLES: string[] = [
  "974810788093116478",
  "1008116120357711936",
  "1188159498045624474",
  "1263644037383061507",
];

function doesAuthorHasRole(message: DiscordMessage, roleId: string): boolean {
  return message.guild.roles.cache.get(roleId)?.members.has(message.author.id);
}

export function getGreaterDiscordRole(message: DiscordMessage): Role {
  const isBot = BOT_ROLES.find((roleId) => doesAuthorHasRole(message, roleId));
  if (isBot) {
    // No role for bots for the moment
    return Roles.FOLLOWER;
  }

  const isBroadcaster = BROADCASTER_ROLES.find((roleId) =>
    doesAuthorHasRole(message, roleId),
  );
  if (isBroadcaster) {
    return Roles.BROADCASTER;
  }

  const isMod = MOD_ROLES.find((roleId) => doesAuthorHasRole(message, roleId));
  if (isMod) {
    return Roles.MOD;
  }

  const isVip = VIP_ROLES.find((roleId) => doesAuthorHasRole(message, roleId));
  if (isVip) {
    return Roles.VIP;
  }

  const isStreamer = STREAMER_ROLES.find((roleId) =>
    doesAuthorHasRole(message, roleId),
  );
  if (isStreamer) {
    // No role for other streamers for the moment
    return Roles.VIP;
  }

  const isSub = SUB_ROLES.find((roleId) => doesAuthorHasRole(message, roleId));
  if (isSub) {
    return Roles.SUB;
  }

  const isMember = MEMBER_ROLES.find((roleId) =>
    doesAuthorHasRole(message, roleId),
  );
  if (isMember) {
    return Roles.FOLLOWER;
  }

  return Roles.NO_ROLE;
}
