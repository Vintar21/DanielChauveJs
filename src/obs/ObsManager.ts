import OBSWebSocket from "obs-websocket-js";
import { canUseObsWebsocket } from "../app";
import { obsWebSocketPassword, obsWebSocketUrl } from "../config/ConfigLoader";
import { allObsCameraEffects } from "./camera-effects/AllObsCameraEffects";
import { INITIAL_MVP_VALUE, MVP_SOURCE } from "./ObsConstants";
import AObsCameraEffect from "./camera-effects/AObsCameraEffect";

export default class ObsManager {
  private static obs: OBSWebSocket = new OBSWebSocket();

  public static updateObsMvpSource(username: string, value: number): void {
    this.updateObsTextSource(MVP_SOURCE, `MVP : ${username} - ${value}`);
  }

  public static resetObsMvpSource(): void {
    this.updateObsTextSource(MVP_SOURCE, INITIAL_MVP_VALUE);
  }

  public static updateObsTextSource(name: string, text: string): void {
    if (canUseObsWebsocket) {
      try {
        ObsManager.obs.connect(obsWebSocketUrl, obsWebSocketPassword).then(() =>
          ObsManager.obs.call("SetInputSettings", {
            inputName: name,
            inputSettings: {
              text,
            },
          }),
        );
      } catch (e) {
        console.log(`OBS source ${name} couldn't be updated`);
        console.log(e);
      }
    }
  }

  public static setSourceFilter(
    source: string,
    filter: string,
    enabled: boolean,
  ): void {
    if (canUseObsWebsocket) {
      try {
        ObsManager.obs.connect(obsWebSocketUrl, obsWebSocketPassword).then(() =>
          ObsManager.obs.call("SetSourceFilterEnabled", {
            sourceName: source,
            filterName: filter,
            filterEnabled: enabled,
          }),
        );
      } catch (e) {
        console.log(
          `OBS filter ${filter} status couldn't be changed on source ${source}`,
        );
        console.log(e);
      }
    }
  }

  public static changeScene(scene: string): void {
    if (canUseObsWebsocket) {
      try {
        ObsManager.obs.connect(obsWebSocketUrl, obsWebSocketPassword).then(() =>
          ObsManager.obs.call("SetCurrentProgramScene", {
            sceneName: scene,
          }),
        );
      } catch (e) {
        console.log(`Can't switch to OBS scene ${scene}`);
        console.log(e);
      }
    }
  }

  public static async getCurrentScene(): Promise<any> {
    if (canUseObsWebsocket) {
      try {
        return ObsManager.obs
          .connect(obsWebSocketUrl, obsWebSocketPassword)
          .then(() => ObsManager.obs.call("GetCurrentProgramScene"));
      } catch (e) {
        console.log(`Can't get OBS current scene`);
        console.log(e);
      }
    }
  }

  public static getObsCameraEffect(input: string): AObsCameraEffect {
    return allObsCameraEffects.find((effect) => effect.match(input));
  }
}
