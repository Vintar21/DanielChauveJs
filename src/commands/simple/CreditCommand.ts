import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "credits";

const options: CommandOptions = new CommandOptions([
  "credit",
  "artistes",
  "badge",
  "badges",
  "emote",
  "emotes",
  "waiting-screen",
  "waiting-screen",
]);
const answer: String =
  "​Les emotes sont attribuées à leur créateurices. Les badges de sub ont été fait par Caudiptera. L'image de fond a été faite par Ultio_";

export default class CreditCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
