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
  private ready: boolean;
  private static obs: OBSWebSocket = new OBSWebSocket();

  private static instance: ObsManager;

  public static async getInstanceAndInit(): Promise<ObsManager> {
    if (!ObsManager.instance) {
      ObsManager.instance = new ObsManager();
    }
    const instance = ObsManager.instance;
    await instance.connect();
    return instance;
  }

  private constructor() {}

  public updateObsMvpSource(username: string, value: number): void {
    this.updateObsTextSource(MVP_SOURCE, `MVP : ${username} - ${value}`);
  }

  public resetObsMvpSource(): void {
    this.updateObsTextSource(MVP_SOURCE, INITIAL_MVP_VALUE);
  }

  private async connect(): Promise<boolean> {
    if (canUseObsWebsocket) {
      await ObsManager.obs
        .connect(obsWebSocketUrl, obsWebSocketPassword)
        .then(() => {
          this.ready = true;
          this.resetObsMvpSource();
          console.log("Connected to OBS Websocket");
        })
        .catch((err) =>
          console.log(
            `Couldn't connect to OBS Websocket, some features won't work : ${err}`,
          ),
        );
    }

    return this.ready;
  }

  public updateObsTextSource(name: string, text: string): void {
    if (canUseObsWebsocket && this.ready) {
      try {
        ObsManager.obs.call(UPDATE_TEXT_SOURCE_CALL, {
          inputName: name,
          inputSettings: {
            text,
          },
        });
      } catch (e) {
        console.log(`OBS source ${name} couldn't be updated`);
        console.log(e);
      }
    }
  }

  public setSourceFilter(
    source: string,
    filter: string,
    enabled: boolean,
  ): void {
    if (canUseObsWebsocket && this.ready) {
      try {
        ObsManager.obs.call(UPDATE_SOURCE_FILTER_CALL, {
          sourceName: source,
          filterName: filter,
          filterEnabled: enabled,
        });
      } catch (e) {
        console.log(
          `OBS filter ${filter} status couldn't be changed on source ${source}`,
        );
        console.log(e);
      }
    }
  }

  public changeScene(scene: string): void {
    if (canUseObsWebsocket && this.ready) {
      try {
        ObsManager.obs.call(SET_SCENE_CALL, {
          sceneName: scene,
        });
      } catch (e) {
        console.log(`Can't switch to OBS scene ${scene}`);
        console.log(e);
      }
    }
  }

  public async getCurrentScene(): Promise<any> {
    if (canUseObsWebsocket && this.ready) {
      try {
        return ObsManager.obs.call(GET_SCENE_CALL);
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
