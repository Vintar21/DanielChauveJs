import {
  Client,
  GatewayIntentBits,
  Events,
  GuildBasedChannel,
} from "discord.js";
import {
  channel,
  discordChannelId,
  discordServerId,
  discordToken,
} from "../config/ConfigLoader";
import { bot, promisedBroadcaster } from "../app";
import SqlManager from "../database/SqlManager";
import { choose } from "../utils/CommonUtils";
import { NEW_LINE, TWITCH_CHANNEL_PREFIX } from "../utils/StringConstants";

export default class DiscordClient extends Client {
  private twitchAnnouncesChannel: GuildBasedChannel;
  private currentStreamStart: number;
  private cooldownBetweenAnnounces: number;

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
  }

  private async getStreamCategoryName(): Promise<string> {
    return promisedBroadcaster.then((broadcaster) =>
      bot.api.channels
        .getChannelInfoById(broadcaster.id)
        .then((channel) => channel.gameName),
    );
  }

  public async start() {
    this.once(Events.ClientReady, (readyClient) => {
      console.log(
        `Discord client ready ! Logged in as ${readyClient.user.tag}`,
      );
      this.twitchAnnouncesChannel = this.guilds.cache
        .get(discordServerId)
        .channels.cache.get(discordChannelId);
    });

    // Log in to Discord with your client's token
    await this.login(discordToken);

    setInterval(() => this.check(), 10 * 1000);
  }

  private async check() {
    // IsReady && IsLiveOn && currentStreamStart est différente de la valeur actuelle
    if (this.isReady) {
      const category = await this.getStreamCategoryName();
      SqlManager.getAnnounceMessagesQuery(category).then((messages) => {
        if (messages.length > 0) {
          this.sendInTwitchAnnounceChannel(
            choose(messages).split("\\r\\n").join(NEW_LINE),
          );
        } else {
          this.sendInTwitchAnnounceChannel(
            `Mais nan un stream incroyable sur ${category} !!!${NEW_LINE}Mieux vaut ne pas louper ça !`,
          );
        }
      });
    }
  }

  // TODO: send an embed
  public sendInTwitchAnnounceChannel(message: string) {
    if (this.twitchAnnouncesChannel.isSendable()) {
      this.twitchAnnouncesChannel.send(
        "@everyone" +
          NEW_LINE +
          message +
          NEW_LINE +
          TWITCH_CHANNEL_PREFIX +
          channel,
      );
    }
  }
}
