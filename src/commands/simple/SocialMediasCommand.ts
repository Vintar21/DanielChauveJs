import { blueskyLink, instagramLink } from "../../utils/ImportConstants";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

export default class SocialMediasCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
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
  private static answer: string = `Retrouvez moi sur Insta: ${instagramLink} ou sur BlueSky: ${blueskyLink} (même si j'y passe quasiment pas)`;

  constructor() {
    super(SocialMediasCommand.options, SocialMediasCommand.answer);
  }
}
