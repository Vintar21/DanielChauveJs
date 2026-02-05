import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

export default class SummaryCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /r[éeêè]sum[éeêè]e?/i,
    /campagne/i,
    /histoire/i,
  ]);

  private static answer: string =
    "Retrouvez le résumé de la campagne ici: https://shorturl.at/owCWc 🐙";

  constructor() {
    super(SummaryCommand.options, SummaryCommand.answer);
  }
}
