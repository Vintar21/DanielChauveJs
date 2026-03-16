import CommandOptions from "../options/CommandOptions";
import MultipleAnswersCommand from "./MultipleAnswersCommand";

export default class NoPrefixSimpleCommand extends MultipleAnswersCommand {
  constructor(
    name: string,
    options: CommandOptions,
    response: string,
    enabled: boolean = true,
  ) {
    options.dontUsePrefix().canUseFullMessage();
    super(name, options, [response], enabled);
  }
}
