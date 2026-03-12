import { _ } from "../../utils/ImportConstants";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "./SimpleCommand";

export default class NoPrefixSimpleCommand extends SimpleCommand {
  constructor(
    name: string,
    options: CommandOptions,
    response: String,
    enabled: boolean = true,
  ) {
    options.dontUsePrefix().canUseFullMessage();
    super(name, options, response, enabled);
  }
}
