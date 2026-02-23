import OBSWebSocket from "obs-websocket-js";
import { canUseObsWebsocket } from "../app";
import { obsWebSocketPassword, obsWebSocketUrl } from "../config/ConfigLoader";
import { log, warn } from "../utils/CommonUtils";
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
  private ready: boolean = false;
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

  public async connect(): Promise<boolean> {
    if (canUseObsWebsocket) {
      await ObsManager.obs
        .connect(obsWebSocketUrl, obsWebSocketPassword)
        .then(() => {
          this.ready = true;
          this.resetObsMvpSource();
          log("Connected to OBS Websocket");
        })
        .catch((err) =>
          warn(
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
        warn(`OBS source ${name} couldn't be updated`);
        log(e);
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
        warn(
          `OBS filter ${filter} status couldn't be changed on source ${source}`,
        );
        log(e);
      }
    }
  }

  public isReady(): boolean {
    return this.ready;
  }

  public changeScene(scene: string): void {
    if (canUseObsWebsocket && this.ready) {
      try {
        ObsManager.obs.call(SET_SCENE_CALL, {
          sceneName: scene,
        });
      } catch (e) {
        warn(`Can't switch to OBS scene ${scene}`);
        log(e);
      }
    }
  }

  public async getCurrentScene(): Promise<any> {
    if (canUseObsWebsocket && this.ready) {
      try {
        return ObsManager.obs.call(GET_SCENE_CALL);
      } catch (e) {
        warn(`Can't get OBS current scene`);
        log(e);
      }
    }
  }

  public static getObsCameraEffect(input: string): AObsCameraEffect {
    return allObsCameraEffects.find((effect) => effect.match(input));
  }
}
