const AUDIO_PATH = "./audio/";
const ROLLED_1_SOUND = AUDIO_PATH + "rolled1.mp3";
const ROLLED_1000_SOUND = AUDIO_PATH + "rolled1000.mp3";

// open VLC to play the sound, check if possible it's possible avoiding it
import Play from "play-sound";

export function playRolled1() {
  const p = Play();
  p.play(ROLLED_1_SOUND, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

export function playRolled1000() {
  const p = Play();
  p.play(ROLLED_1000_SOUND, function (err) {
    if (err) {
      console.log(err);
    }
  });
}
