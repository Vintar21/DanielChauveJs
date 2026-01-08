import SimpleCommand from "../SimpleCommand";
import ACommandBuilder from "./ACommandBuilder";
import { EMPTY } from "../../utils/StringConstants";
import { addPrefixToTriggers } from "../../utils/CommandsUtils";

// Builder for simple commands giving a single response
export default class SimpleCommandBuilder extends ACommandBuilder<SimpleCommand> {
  private response: string = EMPTY;

  public build(): SimpleCommand {
    this.triggers = addPrefixToTriggers(this.triggers, this.prefix);

    return new SimpleCommand(
      this.triggers,
      this.response,
      this.replyToUser,
      this.globalCooldown,
      this.userCooldown,
      this.maxUseGlobal,
      this.maxUsePerUser,
      this.rolesPermissions,
      this.usersPermissions,
      this.prefix
    );
  }

  public setResponse(response: string): SimpleCommandBuilder {
    this.response = response;
    return this;
  }
}
