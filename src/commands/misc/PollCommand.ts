import { HelixPoll } from "@twurple/api";
import { ChatMessage } from "@twurple/chat";
import { EventSubChannelPollEndEvent } from "@twurple/eventsub-base";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { MainApp } from "../../app";
import { log, minutes } from "../../utils/CommonUtils";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";

const CANCEL_POLL = "cancel";
const END_POLL = "stop";

// Status
const ACTIVE = "ACTIVE";
const COMPLETED = "COMPLETED";
const TERMINATED = "TERMINATED";
const ARCHIVED = "ARCHIVED";
const MODERATED = "MODERATED";
const INVALID = "INVALID";

const mainTrigger: string = "poll";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  "polls",
  "sondage",
  "sondages",
  "vote",
  "votes",
]).setRolesPermission(rolesPermissions);

export default class PollCommand extends AArgumentsCommand {
  protected static MAX_POLL_TITLE_LENGTH: number = 60;
  protected static MAX_TIME_POLL: number = minutes(30, true);
  protected static MAX_POLL_CHANNEL_POINT: number = 1000000;

  private defaultDuration: number = minutes(5, true); // Max 1800s = 30min
  private defaultChoices: string[] = ["D'accord", "Pas d'accord"];
  private title: string = "Vous en pensez quoi ?";
  private channelPointsDefault: number = 0;

  private pollListener: EventSubWsListener;

  constructor() {
    super(mainTrigger, options, true);
  }

  public initListener() {
    const twitchClient = MainApp.getTwitchClient();
    if (!this.pollListener) {
      this.pollListener = new EventSubWsListener({
        apiClient: twitchClient.getApi(),
      });
      this.pollListener.start();
      this.pollListener.onChannelPollEnd(
        twitchClient.getBroadcasterId(),
        this.onPollEnded,
      );
    }
  }

  private onPollEnded(pollEndedEvent: EventSubChannelPollEndEvent): void {
    if (
      pollEndedEvent.status === COMPLETED.toLowerCase() ||
      pollEndedEvent.status === TERMINATED.toLowerCase()
    ) {
      MainApp.getDiscordClient().sendInPollResultsChannel(
        pollEndedEvent.title,
        pollEndedEvent.choices,
      );
    }
  }

  private createPoll(
    title: string,
    duration: number,
    choices: string[],
    channelPointsPerVote: number,
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ) {
    var pollData;
    if (channelPointsPerVote > 0) {
      channelPointsPerVote =
        channelPointsPerVote > PollCommand.MAX_POLL_CHANNEL_POINT
          ? PollCommand.MAX_POLL_CHANNEL_POINT
          : channelPointsPerVote;
      pollData = {
        title,
        choices,
        duration,
        channelPointsPerVote,
      };
    } else {
      pollData = {
        title,
        choices,
        duration,
      };
    }
    const twitchClient = MainApp.getTwitchClient();
    twitchClient
      .getPollsApi()
      .createPoll(twitchClient.getBroadcasterId(), pollData)
      .then(() => {
        log(`Poll: ${title} [${choices}] | duration: ${duration}s`);
        this.replyOrSend(
          user,
          chatMessage,
          ignoreCooldowns,
          "Sondage créé, à vos votes !",
        );
      });
  }

  private async getLastPoll(): Promise<HelixPoll | undefined> {
    const twitchClient = MainApp.getTwitchClient();
    const polls = await twitchClient
      .getPollsApi()
      .getPolls(twitchClient.getBroadcasterId());
    return polls?.data?.length > 0 ? polls?.data[0] : undefined;
  }

  private isLastPollFinished(lastPoll: HelixPoll): boolean {
    const status = lastPoll?.status;
    return (
      (lastPoll && status === COMPLETED) || // Poll ended as expected
      status === TERMINATED || // Poll ended before it's normal duration
      status === ARCHIVED || // Poll archived and no longer visible in channel
      status === MODERATED || // Poll deleted
      status === INVALID
    );
  }

  private isLastPollActive(lastPoll: HelixPoll): boolean {
    const status = lastPoll?.status;
    return lastPoll && status === ACTIVE;
  }

  // TODO: add more logging info
  // Return true if we've locked or cancelled the current poll, false otherwise
  protected handleCurrentPoll(
    args: String[],
    lastPoll: HelixPoll,
    user: User,
    chatMessage: ChatMessage,
    ignoreCooldowns: boolean,
  ): boolean {
    if (args.length === 1) {
      const twitchClient = MainApp.getTwitchClient();
      switch (args[0].toLowerCase()) {
        case CANCEL_POLL:
        case END_POLL:
          if (!this.isLastPollFinished(lastPoll)) {
            twitchClient
              .getPollsApi()
              .endPoll(twitchClient.getBroadcasterId(), lastPoll.id)
              .then(() => {
                this.replyOrSend(
                  user,
                  chatMessage,
                  ignoreCooldowns,
                  "Sondage terminé !",
                );
              });
          }
          return true;
      }
    }
    return false;
  }

  protected async executeWithArgs(
    user: User,
    chatMessage: ChatMessage,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void> {
    // TODO:
    // Résultats dans un chan discord dédié
    // Pouvoir donner le résultat de la prédi ?
    this.getLastPoll()?.then((lastPoll) => {
      // If we have a current prediction, check if we want to cancel or lock it
      if (lastPoll && !this.isLastPollFinished(lastPoll)) {
        // Check for particular parameters (cancel, lock, etc.)
        // If we've cancelled or locked it, we stop here
        if (
          !this.handleCurrentPoll(
            args,
            lastPoll,
            user,
            chatMessage,
            ignoreCooldowns,
          )
        ) {
          this.replyOrSend(
            user,
            chatMessage,
            ignoreCooldowns,
            "Il y a déjà un sondage en cours Sadge",
          );
        }
        return;
      }

      // Default, params from last prediction
      var duration = lastPoll?.durationInSeconds ?? this.defaultDuration;
      var title = lastPoll?.title ?? this.title;
      var choices =
        lastPoll?.choices?.map((o) => o.title) ?? this.defaultChoices;
      var channelPoints =
        lastPoll?.channelPointsPerVote ?? this.channelPointsDefault;

      // No args => take the same parameter than the last prediction
      if (args.length > 0) {
        // Check if the first parameter is the time of the prediction
        var timeArg = Number(args[0]);
        if (!isNaN(timeArg) && timeArg > 0) {
          timeArg =
            timeArg > PollCommand.MAX_TIME_POLL
              ? PollCommand.MAX_TIME_POLL
              : timeArg;
          timeArg = timeArg <= 30 ? minutes(timeArg, true) : timeArg; // If the given time is less or equal than 30, we consider it's in minutes and convert it to seconds
          duration = timeArg;
          args = args.slice(1);
        } else {
          duration = this.defaultDuration;
        }

        // If we have more args, we consider it's the title of the prediction and we take the default outcomes
        if (args.length > 0) {
          title = args.join(SPACE);
          choices = this.defaultChoices;
          channelPoints = this.channelPointsDefault;
        }
      }

      if (title.length > PollCommand.MAX_POLL_TITLE_LENGTH) {
        this.replyOrSend(
          user,
          chatMessage,
          ignoreCooldowns,
          `Le titre du sondage est trop long (max ${PollCommand.MAX_POLL_TITLE_LENGTH} caractères) Sadge`,
        );
        return;
      }

      // Create the poll
      this.createPoll(
        title,
        duration,
        choices,
        channelPoints,
        user,
        chatMessage,
        ignoreCooldowns,
      );
    });
    return;
  }
}
