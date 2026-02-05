import { HelixUser } from "@twurple/api";
import { Bot } from "@twurple/easy-bot";
import { EventSubChannelRedemptionAddEvent } from "@twurple/eventsub-base/lib/events/EventSubChannelRedemptionAddEvent";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { send } from "../app";
import { rollCommand } from "../commands/misc/AllMiscCommands";
import { allObsCameraEffects } from "../obs/camera-effects/AllObsCameraEffects";
import AObsCameraEffect from "../obs/camera-effects/AObsCameraEffect";
import { COOLDOWN_CAMERA_EFFECT } from "../obs/ObsCameraFilterEffect";
import { noCamScenes, TIKTOK_SCENE_NAME } from "../obs/ObsConstants";
import ObsManager from "../obs/ObsManager";
import User from "../user/User";
import { choose } from "../utils/CommandsUtils";
import { CHILD_LAUGH_SOUND, playSound } from "../utils/MediaUtils";
import {
  CAMERA_EFFECT_REWARD_ID,
  CHILD_LAUGH_REWARD_ID,
  DRING_REWARD_ID,
  REROLL_REWARD_ID,
  TEST_REWARD_ID,
  TIKTOK_REWARD_ID,
  TOCTOC_REWARD_ID,
} from "../utils/TwitchRewardIdUtils";
import {
  MAX_TIME_TIKTOK_SCENE,
  MIN_TIME_TIKTOK_SCENE,
} from "./ChannelPointsConstants";

export default class ChannelPointsListener {
  private static listener: EventSubWsListener;
  private static broadcaster: Promise<HelixUser>;
  private static instance: ChannelPointsListener;

  constructor(broadcaster: Promise<HelixUser>) {
    ChannelPointsListener.broadcaster = broadcaster;
  }

  public static getInstance(
    bot: Bot,
    broadcaster: Promise<HelixUser>,
  ): ChannelPointsListener {
    if (ChannelPointsListener.instance === undefined) {
      ChannelPointsListener.instance = new ChannelPointsListener(broadcaster);
      ChannelPointsListener.listener = new EventSubWsListener({
        apiClient: bot.api,
      });
    }
    return ChannelPointsListener.instance;
  }

  public init(): void {
    ChannelPointsListener.listener.start();
    ChannelPointsListener.broadcaster.then((broadcaster) => {
      ChannelPointsListener.listener.onChannelRedemptionAdd(
        broadcaster,
        this.onRedemptionRedeemed,
      );
    });
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
    ObsManager.getCurrentScene().then((scene) => {
      const sceneName = scene.currentProgramSceneName;
      if (noCamScenes.includes(sceneName)) {
        send(
          `@${event.userName} espèce de voyeureuse ! Non on ne change pas la scène s'il y a pas la caméra affichée !`,
        );
        // TODO: refund if possible
      } else if (sceneName === TIKTOK_SCENE_NAME) {
        send(
          `Mais ${event.userName}... On est déjà sur la scène... Les brainrots ont fait des dommages...`,
        );
        // TODO: refund if possible
      } else {
        ObsManager.changeScene(TIKTOK_SCENE_NAME);
        var randomCooldown =
          Math.floor(
            Math.random() * (MAX_TIME_TIKTOK_SCENE - MIN_TIME_TIKTOK_SCENE),
          ) + MIN_TIME_TIKTOK_SCENE;
        setTimeout(() => ObsManager.changeScene(sceneName), randomCooldown);
      }
    });
  }

  private onRedemptionRedeemed(event: EventSubChannelRedemptionAddEvent): void {
    const username: string = event.userName;
    const userId: number = parseInt(event.userId);
    const input: string = event.input;

    console.log(
      `Redemption event received: ${event.id} by ${username} (${userId})`,
    );
    switch (event.rewardId) {
      case REROLL_REWARD_ID:
        rollCommand.executeNoMessage(new User(username, userId));
        break;
      case TEST_REWARD_ID:
        rollCommand.executeNoMessage(new User(username, userId));
        break;
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
