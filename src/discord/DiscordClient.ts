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
  discordAnnounceChannelId,
  discordPollsChannelId,
  discordServerId,
  discordToken,
} from "../config/ConfigLoader";
import SqlManager from "../database/SqlManager";
import { choose, hours, log, minutes, pluralize } from "../utils/CommonUtils";
import { NEW_LINE, SPACE } from "../utils/StringConstants";
import { User } from "../utils/user/User";
import ADiscordCommand from "./commands/ADiscordCommand";
import { liveCommand } from "./commands/LiveCommand";
import { rollBg3ServCommand } from "./commands/RollBg3ServCommand";
import { sayCommand } from "./commands/SayCommand";

import {
  CATEGORY_PLACEHOLDER,
  DEFAULT_MESSAGE,
  getGreaterDiscordRole,
  TAG_EVERYONE,
  twitchEmbedTemplate,
} from "./DiscordConstants";

export default class DiscordClient extends Client {
  private twitchAnnouncesChannel: GuildBasedChannel;
  private twitchPollResultsChannel: GuildBasedChannel;

  private currentStreamStart: number;
  private cooldownBetweenLiveAnnounces: number = hours(8);
  private lastLiveAnnounce: number = 0;

  private commands: ADiscordCommand[] = [
    sayCommand,
    liveCommand,
    rollBg3ServCommand,
  ];

  private checkInterval: number = minutes(5);

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  private async getStreamCategoryName(): Promise<string> {
    const twitchClient = MainApp.getTwitchClient();
    return twitchClient
      .getChannelsApi()
      .getChannelInfoById(twitchClient.getBroadcasterId())
      .then((channel) => channel.gameName);
  }

  public getChannel(channelId: string): GuildBasedChannel {
    return this.guilds.cache.get(discordServerId).channels.cache.get(channelId);
  }

  public async start() {
    this.once(Events.ClientReady, (readyClient) => {
      log(`Discord client ready ! Logged in as ${readyClient.user.tag}`);

      // Load the needed channels
      this.twitchAnnouncesChannel = this.getChannel(discordAnnounceChannelId);
      this.twitchPollResultsChannel = this.getChannel(discordPollsChannelId);

      if (this.twitchAnnouncesChannel.isTextBased()) {
        // fetch like 5 messages, filter the ones of the bot and then take the last (or first depending the order)
        this.twitchAnnouncesChannel.messages
          .fetch({ limit: 1 })
          .then((messages) => {
            log(
              `lastMessageDate: ${messages.last().createdAt.valueOf()} | ${Date.now()}`,
            );
            this.lastLiveAnnounce = messages.last().createdAt.valueOf();
            log("last live announce updated");
          });
      }

      readyClient.on("messageCreate", async (message) => {
        log(
          `Message received on Discord: [${message.author.id}] ${message.author.username} in ${message.channel}: ${message.content}`,
        );
        if (message.author.bot) return;
        const parts = message.content.trim().split(SPACE);

        const user = new User(
          message.author.username,
          Number(message.author.id),
          getGreaterDiscordRole(message),
        );

        if (parts.length > 0) {
          const parsedCommand = parts[0].toLowerCase();

          const foundCommand = this.commands.find((command) =>
            command.match(parsedCommand),
          );

          if (foundCommand && (await foundCommand.canExecute(user, message))) {
            foundCommand.execute(message, user, false);
          }
        }
      });
    });

    // Log in to Discord with your client's token
    await this.login(discordToken);

    //setInterval(() => this.check(), this.checkInterval);
  }

  private canSendLiveAnnounce(stream: HelixStream): boolean {
    log(`Ready: ${this.isReady()} | Stream: ${stream} | Current Stream Start: ${this.currentStreamStart} | 
    Last Live Announce: ${this.lastLiveAnnounce} | Diff: ${Date.now() - this.lastLiveAnnounce} |Cooldown: ${this.cooldownBetweenLiveAnnounces}`);
    return (
      this.isReady() &&
      stream !== null &&
      stream &&
      stream.startDate.getDate() !== this.currentStreamStart &&
      Date.now() - this.lastLiveAnnounce > this.cooldownBetweenLiveAnnounces
    );
  }

  public sendMessage(channelId: any, message: string) {
    const channel = this.getChannel(channelId);
    if (channel?.isTextBased()) {
      channel.send(message);
    }
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
