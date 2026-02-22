import { MessageEvent, RaidEvent } from "@twurple/easy-bot";
import { MainApp } from "../app";
import { getGreaterRole } from "../utils/RoleUtils";
import User from "../utils/user/User";
import { log } from "../utils/CommonUtils";

export const onMessage = async (event: MessageEvent) => {
  const message: string = event.text;
  const username: string = event.userName;
  // Do we really need it to be a number ?
  const userId: number = parseInt(event.userId);
  const game = MainApp.getCurrentGame();

  log(`Message received from [${userId}] ${username}: ${message}`);

  MainApp.timerManager.updateAllTimersOnMessage();
  const user = new User(
    username,
    userId,
    getGreaterRole(event.getUser(), MainApp.broadcasterApp),
  );
  MainApp.commandsManager
    .getTriggeredCommand(message, await game)
    .then((triggeredCommand) => {
      triggeredCommand?.canExecute(user).then((canExecute) => {
        if (canExecute) {
          triggeredCommand.execute(user, event);
        }
      });
    });
};

// Waiting list if last shoutout too early
export const onRaid = (event: RaidEvent) => {
  MainApp.broadcasterApp.api.chat.shoutoutUser(
    event.broadcasterId,
    event.userId,
  );
};
