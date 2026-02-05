import {
  discordCommand,
  socialMediasCommand,
  youtubeCommand,
} from "../commands/simple/AllSimpleCommands";
import ATimer from "./ATimer";
import { TimerMessage } from "./TimerMessage";
import TimerOptions from "./TimerOptions";

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
