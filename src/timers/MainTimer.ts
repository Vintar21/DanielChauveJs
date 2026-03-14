import ATwitchClient from "../twitch/ATwitchClient";
import ATimer from "./ATimer";
import { TimerMessage } from "./TimerMessage";
import TimerOptions from "./TimerOptions";

// Commands names to insert in the timer
const discordCommand = "discord";
const youtubeCommand = "youtube";
const socialMediasCommand = "rs";

export default class MainTimer extends ATimer {
  private static messages: TimerMessage[] = [
    discordCommand,
    youtubeCommand,
    socialMediasCommand,
    "​N'hésitez pas à clipper les moments marquants mais PITIÉ nommez les et n'hésitez pas à aller dans votre studio vidéo (si si ça existe) pour supprimer les clips créés accidentellement :)",
  ];
  private static options: TimerOptions = new TimerOptions()
    .setMinNumberOfMessage(20)
    .setTimerInMinutes(10);

  constructor() {
    super(MainTimer.options, MainTimer.messages);
  }
}
