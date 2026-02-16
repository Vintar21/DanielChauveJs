import { minutes } from "../utils/CommonUtils";

export const CameraEffects = Object.freeze({
  BLURRY: Symbol("blurry"),
  MIRROR: Symbol("mirror"),
  DRUNK: Symbol("drunk"),
  BALOON: Symbol("baloon"),
  TV: Symbol("tv"),
  OLD_TV: Symbol("old-tv"),
  HEXAGONES: Symbol("hexagones"),
  PIXELS: Symbol("pixels"),
  HEAT: Symbol("heat"),
  DUPLICATAS: Symbol("duplicatas"),
  SPIRAL: Symbol("Spiral"),
  WAVE: Symbol("wave"),
  WATER: Symbol("water"),
});

export type CameraEffect = symbol;
export const CAMERA_SOURCE_FILTER_NAME = "Filtres Caméra";
export const COOLDOWN_CAMERA_EFFECT = minutes(2);

export const cameraEffectRealName: Map<CameraEffect, string> = new Map<
  CameraEffect,
  string
>([
  [CameraEffects.BLURRY, "Flou"],
  [CameraEffects.MIRROR, "Mirroir"],
  [CameraEffects.DRUNK, "Drunk"],
  [CameraEffects.BALOON, "Ballon"],
  [CameraEffects.TV, "TV"],
  [CameraEffects.OLD_TV, "Vieille TV"],
  [CameraEffects.HEXAGONES, "Ruche"],
  [CameraEffects.PIXELS, "Pixelisation"],
  [CameraEffects.HEAT, "Fluo"],
  [CameraEffects.DUPLICATAS, "MultiClonage"],
  [CameraEffects.SPIRAL, "Tourbillon"],
  [CameraEffects.WAVE, "Vague"],
  [CameraEffects.WATER, "Onde Eau"],
]);
