import OBSWebSocket from "obs-websocket-js";
import { canUseObsWebsocket } from "../app";
import { obsWebSocketPassword, obsWebSocketUrl } from "../config/ConfigLoader";
import { allObsCameraEffects } from "./camera-effects/AllObsCameraEffects";
import AObsCameraEffect from "./camera-effects/AObsCameraEffect";
import {
  GET_SCENE_CALL,
  INITIAL_MVP_VALUE,
  MVP_SOURCE,
  SET_SCENE_CALL,
  UPDATE_SOURCE_FILTER_CALL,
  UPDATE_TEXT_SOURCE_CALL,
} from "./ObsConstants";

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
          ObsManager.obs.call(UPDATE_TEXT_SOURCE_CALL, {
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
          ObsManager.obs.call(UPDATE_SOURCE_FILTER_CALL, {
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
          ObsManager.obs.call(SET_SCENE_CALL, {
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
          .then(() => ObsManager.obs.call(GET_SCENE_CALL));
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
