import { EventSubChannelRedemptionAddEvent } from "@twurple/eventsub-base/lib/events/EventSubChannelRedemptionAddEvent";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { MainApp } from "../app";
import { allObsCameraEffects } from "../obs/camera-effects/AllObsCameraEffects";
import AObsCameraEffect from "../obs/camera-effects/AObsCameraEffect";
import { COOLDOWN_CAMERA_EFFECT } from "../obs/ObsCameraFilterEffect";
import { noCamScenes, TIKTOK_SCENE_NAME } from "../obs/ObsConstants";
import ObsManager from "../obs/ObsManager";
import TwitchClient from "../twitch/TwitchClient";
import { choose, log } from "../utils/CommonUtils";
import { CHILD_LAUGH_SOUND, playSound } from "../utils/MediaUtils";
import { getGreaterRole, Role } from "../utils/RoleUtils";
import {
  CAMERA_EFFECT_REWARD_ID,
  CHILD_LAUGH_REWARD_ID,
  DRING_REWARD_ID,
  MAX_TIME_TIKTOK_SCENE,
  MIN_TIME_TIKTOK_SCENE,
  TIKTOK_REWARD_ID,
  TOCTOC_REWARD_ID,
} from "./ChannelPointsConstants";

export default class ChannelPointsListener {
  private static listener: EventSubWsListener;
  private static instance: ChannelPointsListener;

  constructor() {}

  public static async getInstanceAndInit(
    twitchClient: TwitchClient,
  ): Promise<ChannelPointsListener> {
    var instance = ChannelPointsListener.instance;
    if (instance === undefined) {
      instance = new ChannelPointsListener();
      ChannelPointsListener.listener = new EventSubWsListener({
        apiClient: twitchClient.getApi(),
      });
      await instance.init(twitchClient.getBroadcasterId());
    }
    return instance;
  }

  // Use getInstanceAndInit instead
  protected async init(broadcasterId: string): Promise<void> {
    ChannelPointsListener.listener.start();
    ChannelPointsListener.listener.onChannelRedemptionAdd(
      broadcasterId,
      this.onRedemptionRedeemed,
    );
  }

  private static onCameraEffectRedeemed(input: string): void {
    var cameraEffect: AObsCameraEffect = ObsManager.getObsCameraEffect(
      input.trim(),
    );
    if (!cameraEffect) {
      cameraEffect = choose(allObsCameraEffects);
    }
    cameraEffect.enable();
    setTimeout(() => cameraEffect.disable(), COOLDOWN_CAMERA_EFFECT);
  }

  private static onTikTokSceneRedeemed(
    event: EventSubChannelRedemptionAddEvent,
  ): void {
    MainApp.getObsManager()
      .getCurrentScene()
      .then((scene) => {
        const sceneName = scene?.currentProgramSceneName;
        if (sceneName && noCamScenes.includes(sceneName)) {
          TwitchClient.send(
            `@${event.userName} espèce de voyeureuse ! Non on ne change pas la scène s'il y a pas la caméra affichée !`,
          );
          // TODO: refund if possible
        } else if (sceneName === TIKTOK_SCENE_NAME) {
          TwitchClient.send(
            `Mais ${event.userName}... On est déjà sur la scène... Les brainrots ont fait des dommages...`,
          );
          // TODO: refund if possible
        } else {
          MainApp.getObsManager().changeScene(TIKTOK_SCENE_NAME);
          var randomCooldown =
            Math.floor(
              Math.random() * (MAX_TIME_TIKTOK_SCENE - MIN_TIME_TIKTOK_SCENE),
            ) + MIN_TIME_TIKTOK_SCENE;
          setTimeout(
            () => MainApp.getObsManager().changeScene(sceneName),
            randomCooldown,
          );
        }
      });
  }

  // Example of redemptions that play a sound or that have a link with OBS
  private async onRedemptionRedeemed(
    event: EventSubChannelRedemptionAddEvent,
  ): Promise<void> {
    const username: string = event.userName;
    const userId: number = parseInt(event.userId);
    const input: string = event.input;
    const twitchClient: TwitchClient = MainApp.getTwitchClient();
    const role: Promise<Role> = getGreaterRole(
      event.getUser(),
      twitchClient.getBroadcasterApp(),
    );
    log(`Redemption event received: ${event.id} by ${username} (${userId})`);
    switch (event.rewardId) {
      case CAMERA_EFFECT_REWARD_ID:
        // Can't be a method, need to be a function
        ChannelPointsListener.onCameraEffectRedeemed(input);
        break;
      case CHILD_LAUGH_REWARD_ID:
        playSound(CHILD_LAUGH_SOUND);
        break;
      case DRING_REWARD_ID:
        playSound(DRING_REWARD_ID);
        break;
      case TOCTOC_REWARD_ID:
        playSound(TOCTOC_REWARD_ID);
        break;
      case TIKTOK_REWARD_ID:
        ChannelPointsListener.onTikTokSceneRedeemed(event);
        break;
    }
  }
}
