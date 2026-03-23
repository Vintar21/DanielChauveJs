import { EMPTY } from "../../utils/StringConstants";

export default class WatchStreakEvent extends Event {
  static TYPE: string = "watch-streak-event";

  userId: number;
  streak: number;
  message: string;

  constructor(userId: number, streak: number, message?: string) {
    super(WatchStreakEvent.TYPE);
    this.userId = userId;
    this.streak = streak;
    this.message = message ?? EMPTY;
  }
}
