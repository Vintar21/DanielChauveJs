import { send } from "./app";

export const commandPrefix = "!";

export default class Command {
  private triggers: string[];
  private response: string;
  private replyToUser: boolean;

  constructor(
    triggers: string[],
    response: string,
    replyToUser: boolean = true
  ) {
    this.triggers = triggers;
    this.response = response;
    this.replyToUser = replyToUser;
  }

  public isTriggeredBy(input: string): boolean {
    return this.triggers.includes(input.toLowerCase());
  }

  public answer(): void {
    send(this.response);
  }
}
