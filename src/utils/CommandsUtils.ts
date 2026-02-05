import { MessageEvent } from "@twurple/easy-bot/lib";

export const commandPrefix = "!";
export const NO_MSG: MessageEvent = undefined;
export const JDR_PJ_MESSAGE_START = "Pour en savoir plus sur ";
export const MOOBOT_USER_ID: number = 1564983;

export function addPrefixToTriggers(
  triggers: Array<RegExp>,
  prefix: string,
): Array<RegExp> {
  const prefixedTriggers: Array<RegExp> = [];
  triggers.forEach((trigger) => {
    prefixedTriggers.push(new RegExp(prefix + trigger.source, trigger.flags));
  });
  return prefixedTriggers;
}

export function choose(strings: Array<any>): any {
  return strings[Math.floor(Math.random() * strings.length)];
}
