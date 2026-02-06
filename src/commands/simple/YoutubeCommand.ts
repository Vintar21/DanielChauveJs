import { youtubeLink } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class YoutubeCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([/youtube/i]);
  private static answer: string = `​Twitch nous oblige à limiter les rediffs, mais vous pouvez tout retrouver sur YouTube: ${youtubeLink}`;

  constructor() {
    super(YoutubeCommand.options, YoutubeCommand.answer);
  }
}
