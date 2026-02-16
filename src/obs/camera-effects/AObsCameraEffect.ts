import { obsManager } from "../../app";
import { _ } from "../../utils/ImportConstants";
import {
  CAMERA_SOURCE_FILTER_NAME,
  CameraEffect,
  cameraEffectRealName,
} from "../ObsCameraFilterEffect";
import ObsManager from "../ObsManager";

export default abstract class AObsCameraEffect {
  private type: CameraEffect;
  private triggers: Array<RegExp>;

  constructor(type: CameraEffect, triggers: Array<RegExp>) {
    this.type = type;
    this.triggers = triggers;
  }

  public match(input: string): boolean {
    return _.find(this.triggers, (trigger: RegExp) => trigger.test(input));
  }

  public enable(): void {
    const filterName = cameraEffectRealName.get(this.type);
    if (filterName) {
      this.enableSourceFilter(CAMERA_SOURCE_FILTER_NAME, filterName);
    }
  }

  public disable(): void {
    const filterName = cameraEffectRealName.get(this.type);
    if (filterName) {
      this.disableSourceFilter(CAMERA_SOURCE_FILTER_NAME, filterName);
    }
  }

  private enableSourceFilter(source: string, filter: string): void {
    obsManager.setSourceFilter(source, filter, true);
  }

  private disableSourceFilter(source: string, filter: string): void {
    obsManager.setSourceFilter(source, filter, false);
  }
}
