import CommandOptions from "../../options/CommandOptions";
import SimpleCommand from "../../templates/SimpleCommand";

const mainTrigger: string = "resume";

const options: CommandOptions = new CommandOptions([
  "resumee",
  "campagne",
  "histoire",
]);

const answer: String =
  "Retrouvez le résumé de la campagne ici: https://shorturl.at/owCWc 🐙";

export default class SummaryCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
