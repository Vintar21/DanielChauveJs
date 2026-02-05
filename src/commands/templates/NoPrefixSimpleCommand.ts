import { _ } from "../../utils/ImportConstants";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "./SimpleCommand";

export default class NoPrefixSimpleCommand extends SimpleCommand {
  constructor(options: CommandOptions, response: string) {
    options.dontUsePrefix();
    super(options, response);
  }

  // @Override
  public match(input: string): boolean {
    const formattedInput = input.toLowerCase().trim();
    return (
      _.find(this.options.getTriggers(), (trigger: RegExp) =>
        trigger.test(formattedInput),
      ) !== undefined
    );
  }
}
