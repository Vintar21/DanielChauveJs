import { _ } from "../../utils/ImportConstants";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "./SimpleCommand";

export default class NoPrefixSimpleCommand extends SimpleCommand {
  constructor(
    options: CommandOptions,
    response: String,
    enabled: boolean = true,
  ) {
    options.dontUsePrefix();
    super(options, response, enabled);
  }

  // TODO: add option useFullMessage instead and put that code in ACommand
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
