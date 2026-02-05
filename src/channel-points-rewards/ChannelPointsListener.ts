import { HelixUser } from "@twurple/api";
import { Bot } from "@twurple/easy-bot";
import { EventSubChannelRedemptionAddEvent } from "@twurple/eventsub-base/lib/events/EventSubChannelRedemptionAddEvent";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { rollCommand } from "../commands/misc/AllMiscCommands";
import User from "../user/User";
import { REROLL_REWARD_ID, TEST_REWARD_ID } from "../utils/TwitchRewardIdUtils";

export default class ChannelPointsListener {
  private static listener: EventSubWsListener;
  private static broadcaster: Promise<HelixUser>;
  private static instance: ChannelPointsListener;

  constructor(broadcaster: Promise<HelixUser>) {
    ChannelPointsListener.broadcaster = broadcaster;
  }

  public static getInstance(
    bot: Bot,
    broadcaster: Promise<HelixUser>,
  ): ChannelPointsListener {
    if (ChannelPointsListener.instance === undefined) {
      ChannelPointsListener.instance = new ChannelPointsListener(broadcaster);
      ChannelPointsListener.listener = new EventSubWsListener({
        apiClient: bot.api,
      });
    }
    return ChannelPointsListener.instance;
  }

  public init(): void {
    ChannelPointsListener.listener.start();
    ChannelPointsListener.broadcaster.then((broadcaster) => {
      ChannelPointsListener.listener.onChannelRedemptionAdd(
        broadcaster,
        this.onRedemptionRedeemed,
      );
    });
  }

  private onRedemptionRedeemed(event: EventSubChannelRedemptionAddEvent): void {
    const username: string = event.userName;
    const userId: number = parseInt(event.userId);

    console.log(
      `Redemption event received: ${event.id} by ${username} (${userId})`,
    );
    switch (event.rewardId) {
      case REROLL_REWARD_ID:
        rollCommand.executeNoMessage(new User(username, userId));
        break;
      case TEST_REWARD_ID:
        rollCommand.executeNoMessage(new User(username, userId));
        break;
    }
  }
}
