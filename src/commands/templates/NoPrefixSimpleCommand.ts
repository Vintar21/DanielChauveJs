import { _ } from "../../utils/ImportConstants";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "./SimpleCommand";

export default class NoPrefixSimpleCommand extends SimpleCommand {
  constructor(
    options: CommandOptions,
    response: String,
    enabled: boolean = true,
  ) {
    options.dontUsePrefix().canUseFullMessage();
    super(options, response, enabled);
  }
}
