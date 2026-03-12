import { youtubeLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "youtube";

const options: CommandOptions = new CommandOptions(["ytb"]);
const answer: String = `​Twitch nous oblige à limiter les rediffs, mais vous pouvez tout retrouver sur YouTube: ${youtubeLink}`;

export default class YoutubeCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
