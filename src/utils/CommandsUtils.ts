import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../app";
import Counter from "../counters/Counter";
import { EXCLAMATION_POINT, SLASH } from "../utils/StringConstants";
import TwitchClient from "../twitch/TwitchClient";
import { choose } from "./CommonUtils";

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
  RANDOM_PART_1: "$RAND1",
  RANDOM_PART_2: "$RAND2",
  RANDOM_PART_3: "$RAND3",
  RANDOM_PART_4: "$RAND4",
  RANDOM_PART_5: "$RAND5",
});

export function formatCommandMessage(
  message: String,
  event: MessageEvent,
  randomParts: Map<string, string[]>,
): String {
  const twitchClient: TwitchClient = MainApp.getTwitchClient();
  randomParts.forEach(
    (value, key) => (message = message.replaceAll(key, choose(value))),
  );

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
