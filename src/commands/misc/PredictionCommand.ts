import { HelixPrediction } from "@twurple/api/lib";
import { MessageEvent } from "@twurple/easy-bot";
import { MainApp } from "../../app";
import { User } from "../../utils/user/User";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { SPACE } from "../../utils/StringConstants";
import CommandOptions from "../CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";
import { log, minutes } from "../../utils/CommonUtils";

const CANCEL_PREDICTION = "cancel";
const LOCK_PREDICTION = "stop";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  /pr[eéèê]di(ction)?s?/i,
  /bets?/i,
  /paris?/i,
]).setRolesPermission(rolesPermissions);

export default class PredictionCommand extends AArgumentsCommand {
  private autoLockTime: number = minutes(5, true); // Max 1800s = 30min
  private defaultOutcomes: string[] = ["Oui", "Non"];
  private title: string = "Est-ce que ça va arriver ?";

  constructor() {
    super(options, true);
  }

  private createPrediction(
    predictionTitle: string,
    autoLockTime: number,
    outcomes: string[],
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ) {
    const twitchClient = MainApp.getTwitchClient();
    twitchClient
      .getPredictionApi()
      .createPrediction(twitchClient.getBroadcasterId(), {
        autoLockAfter: autoLockTime,
        title: predictionTitle,
        outcomes: outcomes,
      })
      .then(() => {
        log(
          `Prediction: ${predictionTitle} [${outcomes}] | duration: ${autoLockTime}s`,
        );
        this.replyOrSend(
          user,
          event,
          ignoreCooldowns,
          "Prédiction créée, à vos votes !",
        );
      });
  }

  private async getLastPrediction(): Promise<HelixPrediction> {
    const twitchClient = MainApp.getTwitchClient();

    const predictions = await twitchClient
      .getPredictionApi()
      .getPredictions(twitchClient.getBroadcasterId());
    return predictions?.data?.length > 0 ? predictions?.data[0] : undefined;
  }

  private isLastPredictionFinished(lastPrediction: HelixPrediction): boolean {
    const status = lastPrediction?.status;
    return (lastPrediction && status === "RESOLVED") || status === "CANCELED";
  }

  private isLastPredictionActive(lastPrediction: HelixPrediction): boolean {
    const status = lastPrediction?.status;
    return lastPrediction && status === "ACTIVE";
  }

  private isLastPredictionLocked(lastPrediction: HelixPrediction): boolean {
    const status = lastPrediction?.status;
    return lastPrediction && status === "LOCKED";
  }

  // TODO: add more logging info
  // Return true if we've locked or cancelled the current prediction, false otherwise
  protected handleCurrentPrediction(
    args: String[],
    lastPrediction: HelixPrediction,
    user: User,
    event: MessageEvent,
    ignoreCooldowns: boolean,
  ): boolean {
    if (args.length === 1) {
      const twitchClient = MainApp.getTwitchClient();
      switch (args[0].toLowerCase()) {
        case CANCEL_PREDICTION:
          if (!this.isLastPredictionFinished(lastPrediction)) {
            twitchClient
              .getPredictionApi()
              .cancelPrediction(
                twitchClient.getBroadcasterId(),
                lastPrediction.id,
              )
              .then(() => {
                this.replyOrSend(
                  user,
                  event,
                  ignoreCooldowns,
                  "Prédiction annulée !",
                );
              });
          }
          return true;
        case LOCK_PREDICTION:
          this.getLastPrediction()?.then((lastPrediction) => {
            if (this.isLastPredictionActive(lastPrediction)) {
              twitchClient
                .getPredictionApi()
                .lockPrediction(
                  twitchClient.getBroadcasterId(),
                  lastPrediction.id,
                )
                .then(() => {
                  this.replyOrSend(
                    user,
                    event,
                    ignoreCooldowns,
                    "Votes terminés !",
                  );
                });
            }
          });
          return true;
      }
    }
    return false;
  }

  protected executeWithArgs(
    user: User,
    event: MessageEvent,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void> {
    // TODO:
    // Résultats dans un chan discord dédié
    // Pouvoir donner le résultat de la prédi ?
    this.getLastPrediction()?.then((lastPrediction) => {
      // If we have a current prediction, check if we want to cancel or lock it
      if (!this.isLastPredictionFinished(lastPrediction)) {
        // Check for particular parameters (cancel, lock, etc.)
        // If we've cancelled or locked it, we stop here
        if (
          !this.handleCurrentPrediction(
            args,
            lastPrediction,
            user,
            event,
            ignoreCooldowns,
          )
        ) {
          this.replyOrSend(
            user,
            event,
            ignoreCooldowns,
            "Il y a déjà une prédiction en cours Sadge",
          );
        }
        return;
      }

      // Default, params from last prediction
      var autoLockTime = lastPrediction?.autoLockAfter ?? this.autoLockTime;
      var title = lastPrediction?.title ?? this.title;
      var outcomes =
        lastPrediction?.outcomes?.map((o) => o.title) ?? this.defaultOutcomes;

      // No args => take the same parameter than the last prediction
      if (args.length > 0) {
        // Check if the first parameter is the time of the prediction
        var timeArg = Number(args[0]);
        if (!isNaN(timeArg) && timeArg > 0) {
          timeArg = timeArg > minutes(30, true) ? minutes(30, true) : timeArg; // Twitch max duration is 1800s (30min)
          timeArg = timeArg <= 30 ? minutes(timeArg, true) : timeArg; // If the given time is less or equal than 30, we consider it's in minutes and convert it to seconds
          autoLockTime = timeArg;
          args = args.slice(1);
        } else {
          autoLockTime = this.autoLockTime;
        }

        // If we have more args, we consider it's the title of the prediction and we take the default outcomes
        if (args.length > 0) {
          title = args.join(SPACE);
          outcomes = this.defaultOutcomes;
        }
      }

      if (title.length > 45) {
        this.replyOrSend(
          user,
          event,
          ignoreCooldowns,
          "Le titre de la prédiction est trop long (max 45 caractères) Sadge",
        );
        return;
      }

      // Create the prediction
      this.createPrediction(
        title,
        autoLockTime,
        outcomes,
        user,
        event,
        ignoreCooldowns,
      );
    });
    return;
  }
}
