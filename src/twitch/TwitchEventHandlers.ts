import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../app";
import { getGreaterRole } from "../utils/RoleUtils";
import { User } from "../utils/user/User";
import { log } from "../utils/CommonUtils";
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
};
