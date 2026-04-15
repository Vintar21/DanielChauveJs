import { ChatMessage } from "@twurple/chat";
import { MainApp } from "../app";
import { isString, log } from "../utils/CommonUtils";
import { getUserWithRole, Roles } from "../utils/RoleUtils";
import { EMPTY } from "../utils/StringConstants";
import { User } from "../utils/user/User";
import TwitchClient from "./TwitchClient";

export const onChatMessage = async (
  channel: string,
  username: string,
  message: string,
  chatMessage: ChatMessage,
) => {
  const twitchClient = MainApp.getTwitchClient();

  // Don't take into account bot own messages
  if (twitchClient.getBotId() === chatMessage.userInfo.userId) {
    log(`Bot response ${username}: ${message})`);
    return;
  }

  log(
    `Message received from [${chatMessage.userInfo.userId}] ${username}: ${message} ${chatMessage.isFirst ? "| First Message" : EMPTY} ${chatMessage.isRedemption ? " | Redemption" : EMPTY} ${chatMessage.isHighlight ? "| Highlight" : EMPTY}`,
  );

  const user: User = await getUserWithRole(chatMessage.userInfo);

  if (chatMessage.isFirst) {
    const moderated = filterMessage(message, user);
    if (moderated) return;
  }

  // No command check in redemption, see ChannelPointListener
  if (chatMessage.isRedemption) return;

  const game = twitchClient.getCurrentGame();

  TwitchClient.timerManager.updateAllTimersOnMessage();
  MainApp.getTwitchClient()
    .getCommandsManager()
    .getTriggeredCommand(message, await game)
    .then((triggeredCommand) => {
      triggeredCommand?.canExecute(user).then((canExecute) => {
        if (canExecute) {
          triggeredCommand.execute(user, chatMessage);
        }
      });
    });
};

type BanWord = string | RegExp;
const bestViewersBotMessages: BanWord[] = [
  "streamboo",
  "nezhna",
  /(t[o0]p|best)\s*vieweu?rs?\s+[a-z0-9]\.ru/gi,
];

// Return true if message was filtered = message was moderated
export async function filterMessage(
  message: string,
  user: User,
): Promise<boolean> {
  if (user.role === Roles.NO_ROLE) {
    const isBestViewerScam = bestViewersBotMessages.find((expression) => {
      var matching = false;
      if (isString(expression)) {
        matching = message.includes(expression.toString());
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
      log(`User ${user.username} banned for best viewer scam`);
      return true;
    }
  }
  return false;
}
