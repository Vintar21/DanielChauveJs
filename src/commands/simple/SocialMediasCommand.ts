import { blueskyLink, instagramLink } from "../../config/ConfigLoader";
import CommandOptions from "../options/CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const mainTrigger: string = "rs";

const options: CommandOptions = new CommandOptions([
  "rezo",
  "insta",
  "instagram",
  "bluesky",
  "twitter",
  "x",
  "threads",
  /rese?aux?-?(sociaux?)?/i,
  /socials?-?(medias?)?/i,
]);

const answer: String = `Retrouvez moi sur Insta: ${instagramLink} ou sur BlueSky: ${blueskyLink} (même si j'y passe quasiment pas)`;

export default class SocialMediasCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(mainTrigger, options, answer, enabled);
  }
}
