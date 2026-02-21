import { channel } from "../config/ConfigLoader";
import { EmbedBuilder } from "discord.js";
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
