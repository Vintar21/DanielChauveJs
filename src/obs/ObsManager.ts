import OBSWebSocket from "obs-websocket-js";
import {
  _,
  obsWebSocketUrl,
  obsWebSocketPassword,
} from "../utils/ImportConstants";
import { INITIAL_MVP_VALUE, MVP_SOURCE } from "./ObsConstants";

export default class ObsManager {
  private static obs: OBSWebSocket = new OBSWebSocket();

  public static updateObsMvpSource(username: string, value: number): void {
    this.updateObsTextSource(MVP_SOURCE, `MVP : ${username} - ${value}`);
  }

  public static resetObsMvpSource(): void {
    this.updateObsTextSource(MVP_SOURCE, INITIAL_MVP_VALUE);
  }

  public static updateObsTextSource(name: string, text: string): void {
    try {
      ObsManager.obs.connect(obsWebSocketUrl, obsWebSocketPassword).then(() =>
        ObsManager.obs.call("SetInputSettings", {
          inputName: name,
          inputSettings: {
            text,
          },
        })
      );
    } catch (e) {
      console.log(`OBS source ${name} couldn't be updated`);
      console.log(e);
    }
  }
}
