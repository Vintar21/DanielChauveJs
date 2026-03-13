import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../app";
import { log } from "../utils/CommonUtils";
import { getGreaterRole, Roles } from "../utils/RoleUtils";
import { User } from "../utils/user/User";
import TwitchClient from "./TwitchClient";

export const onMessage = async (event: MessageEvent) => {
  const twitchClient = MainApp.getTwitchClient();
  const message: string = event.text;
  const username: string = event.userName;
  // Do we really need it to be a number ?
  const userId: number = parseInt(event.userId);
  const game = twitchClient.getCurrentGame();

  log(`Message received from [${userId}] ${username}: ${message}`);

  TwitchClient.timerManager.updateAllTimersOnMessage();
  const user = new User(
    username,
    userId,
    getGreaterRole(event.getUser(), twitchClient.getBroadcasterApp()),
  );
  TwitchClient.commandsManager
    .getTriggeredCommand(message, await game)
    .then((triggeredCommand) => {
      triggeredCommand?.canExecute(user).then((canExecute) => {
        if (canExecute) {
          triggeredCommand.execute(user, event);
        }
      });
    });

  // Filter undesired message and make appropriate moderation action
  // TODO: OnChatMessage => if isFirstMessage apply filter first then commands etc
  filterMessage(message, user);
};

type BanWord = string | RegExp;
const bestViewersBotMessages: BanWord[] = [
  "streamboo",
  /(t[o0]p|best)\s*vieweu?rs?\s+[a-z0-9]\.ru/gi,
];

async function filterMessage(message: string, user: User): Promise<void> {
  if ((await user.getGreaterRole()) === Roles.NO_ROLE) {
    const isBestViewerScam = bestViewersBotMessages.find((expression) => {
      var matching = false;
      if (typeof expression === "string") {
        matching = message.includes(expression);
      } else if (expression instanceof RegExp) {
        matching = message.match(expression) !== null;
      }
      return matching;
    });

    if (isBestViewerScam) {
      const twitchClient = MainApp.getTwitchClient();
      twitchClient.getModerationApi().banUser(twitchClient.getBroadcaster(), {
        reason: "Best viewer scam",
        user: user.userId,
      });
    }
  }
}
