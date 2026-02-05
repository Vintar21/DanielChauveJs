import { docRollLink } from "../../utils/ImportConstants";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class DocRollCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /doc(roll|g?sheet|messages?)/i,
    /roll(doc|g?sheet|messages?)/i,
  ]);

  //TODO: hide links
  private static answer: string = `​Vous pouvez proposer des idées de réponses à vos !roll ici : ${docRollLink}`;

  constructor() {
    super(DocRollCommand.options, DocRollCommand.answer);
  }
}
