import { HelixStream, HelixUser } from "@twurple/api/lib";
import { EventSubChannelPollChoice } from "@twurple/eventsub-base/lib/events/common/EventSubChannelPollChoice";
import {
  Client,
  Events,
  GatewayIntentBits,
  GuildBasedChannel,
} from "discord.js";
import { MainApp } from "../app";
import {
  channel,
  discordAnnounceChannelId,
  discordPollsChannelId,
  discordServerId,
  discordToken,
} from "../config/ConfigLoader";
import SqlManager from "../database/SqlManager";
import { choose, hours, minutes, pluralize } from "../utils/CommonUtils";
import { NEW_LINE } from "../utils/StringConstants";
import {
  CATEGORY_PLACEHOLDER,
  DEFAULT_MESSAGE,
  TAG_EVERYONE,
  twitchEmbedTemplate,
} from "./DiscordConstants";

export default class DiscordClient extends Client {
  private twitchAnnouncesChannel: GuildBasedChannel;
  private twitchPollResultsChannel: GuildBasedChannel;

  private currentStreamStart: number;
  private cooldownBetweenLiveAnnounces: number = hours(8);
  private lastLiveAnnounce: number = 0;

  private checkInterval: number = minutes(5);

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
  }

  private async getStreamCategoryName(): Promise<string> {
    const broadcasterResolved = await MainApp.getBroadcaster();
    return MainApp.broadcasterApp.api.channels
      .getChannelInfoById(broadcasterResolved.id)
      .then((channel) => channel.gameName);
  }

  public async start() {
    this.once(Events.ClientReady, (readyClient) => {
      console.log(
        `Discord client ready ! Logged in as ${readyClient.user.tag}`,
      );

      // Load the needed channels
      this.twitchAnnouncesChannel = this.guilds.cache
        .get(discordServerId)
        .channels.cache.get(discordAnnounceChannelId);

      this.twitchPollResultsChannel = this.guilds.cache
        .get(discordServerId)
        .channels.cache.get(discordPollsChannelId);
    });

    // Log in to Discord with your client's token
    await this.login(discordToken);

    setInterval(() => this.check(), this.checkInterval);
  }

  // TODO: move it in a dedicated class or Utils
  private getCurrentStream(broadcaster: HelixUser): Promise<HelixStream> {
    return broadcaster.getStream();
  }

  private canSendLiveAnnounce(stream: HelixStream): boolean {
    return (
      this.isReady() &&
      stream !== null &&
      stream !== undefined &&
      stream.startDate.getDate() !== this.currentStreamStart &&
      Date.now() - this.lastLiveAnnounce > this.cooldownBetweenLiveAnnounces
    );
  }

  private async check() {
    const broadcaster =
      await MainApp.broadcasterApp.api.users.getUserByName(channel);
    const stream = await this.getCurrentStream(broadcaster);
    if (this.canSendLiveAnnounce(stream)) {
      const category = await this.getStreamCategoryName();
      SqlManager.getAnnounceMessagesQuery(category).then((messages) => {
        if (messages.length > 0) {
          this.sendInTwitchAnnounceChannel(
            choose(messages).split("\\r\\n").join(NEW_LINE),
            stream,
            broadcaster,
          );
        } else {
          this.sendInTwitchAnnounceChannel(
            DEFAULT_MESSAGE.replace(CATEGORY_PLACEHOLDER, category),
            stream,
            broadcaster,
          );
        }
        this.getCurrentStream(broadcaster).then(
          (stream) => (this.currentStreamStart = stream.startDate.getDate()),
        );
      });
    }
  }

  public sendInPollResultsChannel(
    title: string,
    choices: EventSubChannelPollChoice[],
  ) {
    if (this.twitchPollResultsChannel.isSendable()) {
      var message = `# ${title}\r\n`;
      var winners: EventSubChannelPollChoice[] = [];
      choices.forEach((choice) => {
        message += `- ${choice.title}: **${choice.totalVotes}**\r\n`;
        if (
          winners.length === 0 ||
          choice.totalVotes >= winners[0].totalVotes
        ) {
          if (winners.length > 0 && choice.totalVotes > winners[0].totalVotes) {
            winners = [];
          }
          winners.push(choice);
        }
      });
      message += `--------------------------------------------------\r\n`;
      const winnerVotes = winners[0].totalVotes;
      if (winners.length > 1) {
        message += `Choix gagnants a égalité avec ${winnerVotes} ${pluralize("vote", winnerVotes)}: \r\n`;
        winners.forEach((winner) => (message += `- **${winner.title}**\r\n`));
      } else {
        message += `Choix gagnant avec ${winnerVotes} ${pluralize("vote", winnerVotes)}: **${winners[0].title}**`;
      }
      this.twitchPollResultsChannel.send(message);
    }
  }

  public async sendInTwitchAnnounceChannel(
    message: string,
    stream: HelixStream,
    broadcaster: HelixUser,
  ): Promise<void> {
    if (this.twitchAnnouncesChannel.isSendable()) {
      const embed = twitchEmbedTemplate;
      const content = TAG_EVERYONE + NEW_LINE + message;
      embed.setTitle(`🔴 ${stream.title}`);
      embed.setFields({
        name: "Stream",
        value: stream.gameName,
        inline: true,
      });
      embed.setThumbnail(broadcaster.profilePictureUrl);

      this.twitchAnnouncesChannel.send({ content, embeds: [embed] });
    }
  }
}
