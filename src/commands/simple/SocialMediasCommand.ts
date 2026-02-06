import { blueskyLink, instagramLink } from "../../config/ConfigLoader";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
  /rs/i,
  /r[éeèê]se?aux?-?(sociaux?)?/i,
  /rezo/i,
  /socials?-?(medias?)?/i,
  /insta(gram)?/i,
  /blue?sky/i,
  /tw(i|ee)tt?er/i,
  /x/i,
  /threads?/i,
]);

const answer: String = `Retrouvez moi sur Insta: ${instagramLink} ou sur BlueSky: ${blueskyLink} (même si j'y passe quasiment pas)`;

export default class SocialMediasCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
