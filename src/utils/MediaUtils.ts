const AUDIO_PATH = "./audio/";
export const ROLLED_1_SOUND = AUDIO_PATH + "rolled1.mp3";
export const ROLLED_1000_SOUND = AUDIO_PATH + "rolled1000.mp3";
export const DRING_SOUND = AUDIO_PATH + "dring.mp3";
export const CHILD_LAUGH_SOUND = AUDIO_PATH + "laugh.mp3";
export const TOCTOC_SOUND = AUDIO_PATH + "toctoc.mp3";

// open VLC to play the sound, check if possible it's possible avoiding it
import Play from "play-sound";
const player = Play();

export function playSound(sound: string) {
  player.play(sound, function (err) {
    if (err) {
      console.log(err);
    }
  });
}
