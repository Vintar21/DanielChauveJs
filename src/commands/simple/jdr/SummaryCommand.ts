import CommandOptions from "../../CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /r[éeêè]sum[éeêè]e?/i,
  /campagne/i,
  /histoire/i,
]);

const answer: String =
  "Retrouvez le résumé de la campagne ici: https://shorturl.at/owCWc 🐙";

export default class SummaryCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
