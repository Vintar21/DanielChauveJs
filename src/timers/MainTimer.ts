import {
  blueskyLink,
  discordLink,
  instagramLink,
  youtubeLink,
} from "../utils/ImportConstants";
import ATimer from "./ATimer";
import TimerOptions from "./TimerOptions";

export default class MainTimer extends ATimer {
  private static messages: String[] = [
    `Ouais y a un discord: ${discordLink}`,
    `​Twitch nous oblige à limiter les rediffs, mais vous pouvez tout retrouver sur YouTube: ${youtubeLink}`,
    `Retrouvez moi sur Insta: ${instagramLink} ou sur BlueSky: ${blueskyLink} (même si j'y passe quasiment pas)`,
    "​N'hésitez pas à clipper les moments marquants mais PITIÉ nommez les et n'hésitez pas à aller dans votre studio vidéo (si si ça existe) pour supprimer les clips créés accidentellement :)",
  ];
  private static options: TimerOptions = new TimerOptions()
    .setMinNumberOfMessage(20)
    .setTimerInMinutes(10);

  constructor() {
    super(MainTimer.options, MainTimer.messages);
  }
}
