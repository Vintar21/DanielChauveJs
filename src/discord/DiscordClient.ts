import { HelixStream, HelixUser } from "@twurple/api/lib";
import { EventSubChannelPollChoice } from "@twurple/eventsub-base/lib/events/common/EventSubChannelPollChoice";
import {
  Client,
  Events,
  GatewayIntentBits,
  GuildBasedChannel,
} from "discord.js";
import { MainApp, send } from "../app";
import {
  channel,
  discordAnnounceChannelId,
  discordCommandsChannelId,
  discordPollsChannelId,
  discordServerId,
  discordToken,
} from "../config/ConfigLoader";
import SqlManager from "../database/SqlManager";
import { choose, hours, log, minutes, pluralize } from "../utils/CommonUtils";
import { EMPTY, NEW_LINE, SPACE } from "../utils/StringConstants";
import {
  CATEGORY_PLACEHOLDER,
  DEFAULT_MESSAGE,
  DISCORD_COMMAND_PREFIX,
  TAG_EVERYONE,
  TWITCH_ARGUMENT,
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
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  private async getStreamCategoryName(): Promise<string> {
    const broadcasterResolved = await MainApp.getBroadcaster();
    return MainApp.broadcasterApp.api.channels
      .getChannelInfoById(broadcasterResolved.id)
      .then((channel) => channel.gameName);
  }

  private getChannel(channelId: string): GuildBasedChannel {
    return this.guilds.cache.get(discordServerId).channels.cache.get(channelId);
  }

  public async start() {
    this.once(Events.ClientReady, (readyClient) => {
      log(`Discord client ready ! Logged in as ${readyClient.user.tag}`);

      // Load the needed channels
      this.twitchAnnouncesChannel = this.getChannel(discordAnnounceChannelId);
      this.twitchPollResultsChannel = this.getChannel(discordPollsChannelId);

      if (this.twitchAnnouncesChannel.isTextBased()) {
        this.twitchAnnouncesChannel.messages
          .fetch({ limit: 1 })
          .then(
            (messages) =>
              (this.lastLiveAnnounce = messages
                .last()
                .createdAt.getMilliseconds()),
          );
      }

      readyClient.on("messageCreate", (message) => {
        log(
          `Message received on Discord: [${message.author.id}] ${message.author.username} in ${message.channel}: ${message.content}`,
        );
        if (message.author.bot) return;
        if (
          message.channelId === discordCommandsChannelId &&
          message.content.startsWith(DISCORD_COMMAND_PREFIX)
        ) {
          const parts = message.content.trim().split(SPACE);
          if (parts.length > 0) {
            const command = parts[0]
              .substring(DISCORD_COMMAND_PREFIX.length)
              .toLowerCase();
            this.onCommandMessage(command, parts.slice(1));
          }
        }
      });
    });

    // Log in to Discord with your client's token
    await this.login(discordToken);

    //setInterval(() => this.check(), this.checkInterval);
  }

  // TODO: create DiscordCommands objects
  private async onCommandMessage(command: string, args: string[]) {
    switch (command) {
      case "say":
        if (args.length > 1) {
          const channelId = args[0].toLowerCase().replaceAll(/[<>#]/g, EMPTY);
          const message = args.slice(1).join(SPACE);
          if (channelId === TWITCH_ARGUMENT) {
            send(message);
          } else {
            const channel = this.getChannel(channelId);
            if (channel && channel?.isSendable()) {
              channel.send(message);
            }
          }
        }
        break;
      case "live":
        const broadcaster = MainApp.getBroadcaster();
        const stream = await this.getCurrentStream(broadcaster);
        this.sendLiveAnounce(stream, broadcaster);
        break;
    }
  }

  // TODO: move it in a dedicated class or Utils
  private getCurrentStream(broadcaster: HelixUser): Promise<HelixStream> {
    return broadcaster.getStream();
  }

  private canSendLiveAnnounce(stream: HelixStream): boolean {
    return (
      this.isReady() &&
      stream !== null &&
      stream &&
      stream.startDate.getDate() !== this.currentStreamStart &&
      Date.now() - this.lastLiveAnnounce > this.cooldownBetweenLiveAnnounces
    );
  }

  public async sendLiveAnounce(stream: HelixStream, broadcaster: HelixUser) {
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
        this.currentStreamStart = stream.startDate.getDate();
      });
    }
  }

  public sendInPollResultsChannel(
    title: string,
    choices: EventSubChannelPollChoice[],
  ) {
    if (this.twitchPollResultsChannel.isSendable()) {
      var message = `# ${title}${NEW_LINE}`;
      var winners: EventSubChannelPollChoice[] = [];
      choices.forEach((choice) => {
        message += `- ${choice.title}: **${choice.totalVotes}**${NEW_LINE}`;
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
      this.lastLiveAnnounce = Date.now();
      log("Discord live announce sent");
    }
  }
}
