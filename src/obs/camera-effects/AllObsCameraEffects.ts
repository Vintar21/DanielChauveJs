import { CameraEffects } from "../ObsCameraFilterEffect";
import AObsCameraEffect from "./AObsCameraEffect";

class BaloonCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.BALOON, [/ba?ll?oo?ns?/i]);
  }
}
export const baloonCameraEffect = new BaloonCameraEffect();

class BlurryCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.BLURRY, [/flou/i, /blur(ry)?/i]);
  }
}
export const blurryCameraEffect = new BlurryCameraEffect();

class DrunkCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.DRUNK, [/drunk/i, /ivre/i, /bourr?[éeèê]/i]);
  }
}
export const drunkCameraEffect = new DrunkCameraEffect();

class DuplicatasCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.DUPLICATAS, [/multiclonages?/i, /duplicatas?/i]);
  }
}
export const duplicatasCameraEffect = new DuplicatasCameraEffect();

class HeatCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.HEAT, [
      /th?ermique/i,
      /heat/i,
      /chaleur/i,
      /cam[eéèê]ra\s+th?ermique/i,
    ]);
  }
}
export const heatCameraEffect = new HeatCameraEffect();

class HexagonesCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.HEXAGONES, [
      /ruches?/i,
      /hexa(gones?)?/i,
      /abeilles?/i,
    ]);
  }
}
export const hexagonesCameraEffect = new HexagonesCameraEffect();

class MirrorCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.MIRROR, [/mir+oi?r+/i, /s[yi]m[éeèê]tr[iy](qu)?e?/i]);
  }
}
export const mirrorCameraEffect = new MirrorCameraEffect();

class OldTvCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.OLD_TV, [
      /old\stv/i,
      /vieille\stv/i,
      /ancien(ne)?\stv/i,
    ]);
  }
}
export const oldTvCameraEffect = new OldTvCameraEffect();

class PixelCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.PIXELS, [/pixels?/i, /pixell?is(ation|[éeèê]r)/i]);
  }
}
export const pixelCameraEffect = new PixelCameraEffect();

class SpiralCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.SPIRAL, [/tourbillon/i, /spirale?/i, /vortex/i]);
  }
}
export const spiralCameraEffect = new SpiralCameraEffect();

class TvCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.TV, [/tv/i, /t[éeèê]l[éeèê](vision)?/i]);
  }
}
export const tvCameraEffect = new TvCameraEffect();

class WaterCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.WATER, [/vague/i, /water/i, /onde\seau/i]);
  }
}
export const waterCameraEffect = new WaterCameraEffect();

class WaveCameraEffect extends AObsCameraEffect {
  constructor() {
    super(CameraEffects.WAVE, [/vague/i, /wave/i]);
  }
}
export const waveCameraEffect = new WaveCameraEffect();

export const allObsCameraEffects: Array<AObsCameraEffect> = [
  baloonCameraEffect,
  blurryCameraEffect,
  drunkCameraEffect,
  duplicatasCameraEffect,
  heatCameraEffect,
  hexagonesCameraEffect,
  mirrorCameraEffect,
  oldTvCameraEffect,
  pixelCameraEffect,
  spiralCameraEffect,
  tvCameraEffect,
  waterCameraEffect,
  waveCameraEffect,
];
