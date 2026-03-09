import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../app";
import Counter from "../counters/Counter";
import { EXCLAMATION_POINT, SLASH } from "../utils/StringConstants";
import TwitchClient from "../twitch/TwitchClient";

export const COMMAND_PREFIX = EXCLAMATION_POINT;
export const TWITCH_UNAUTHORIZED_PREFIXES = [SLASH];
export const NO_MSG = undefined;

// Use count
export type UseCount = number;
export const UNLIMITED: UseCount = -1;

export type Trigger = RegExp | string;

export const Placeholders = Object.freeze({
  BROADCASTER: "$BROADCASTER",
  COUNTER: "$COUNTER",
  CATEGORY: "$CATEGORY",
  USER: "$USER",
  INPUT: "$INPUT",
});

// Messages or parts of messages
export const JDR_PJ_MESSAGE_START = "Pour en savoir plus sur ";
export const FOLLOWER_COUNT_MESSAGE =
  "Comme le nombre de followers ici, pourtant on aimerait tous que tu n'en fasse pas partie.";

export function formatCommandMessage(
  message: String,
  event: MessageEvent,
): String {
  const twitchClient: TwitchClient = MainApp.getTwitchClient();
  return message
    .replaceAll(Placeholders.BROADCASTER, twitchClient.getBroadcaster().name)
    .replaceAll(Placeholders.USER, event.userName);
}

export function formatCounterMessage(
  message: String,
  counter: Counter,
): String {
  return message
    .replaceAll(Placeholders.COUNTER, counter.getValue().toString())
    .replaceAll(Placeholders.CATEGORY, counter.getCategory()?.toString());
}
