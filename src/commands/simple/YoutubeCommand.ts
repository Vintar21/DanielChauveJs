import { youtubeLink } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([/youtube/i]);
const answer: String = `​Twitch nous oblige à limiter les rediffs, mais vous pouvez tout retrouver sur YouTube: ${youtubeLink}`;

export default class YoutubeCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
