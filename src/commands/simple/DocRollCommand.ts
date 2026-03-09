import { docRollLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /doc(roll|g?sheet|messages?)/i,
  /roll(doc|g?sheet|messages?)/i,
]);

const answer: String = `​Vous pouvez proposer des idées de réponses à vos rolls ici : ${docRollLink}`;

export default class DocRollCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
