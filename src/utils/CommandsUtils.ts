export const commandPrefix = "!";

export function addPrefixToTriggers(
  triggers: Array<RegExp>,
  prefix: string
): Array<RegExp> {
  const prefixedTriggers: Array<RegExp> = [];
  triggers.forEach((trigger) => {
    prefixedTriggers.push(new RegExp(prefix + trigger.source, trigger.flags));
  });
  return prefixedTriggers;
}
