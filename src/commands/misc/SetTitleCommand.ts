import { ChatMessage } from "@twurple/chat";
import { MainApp } from "../../app";
import { Permissions } from "../../utils/permissions/Permissions";
import { getModOnlyRolesPermissions, Role } from "../../utils/RoleUtils";
import { PIPE, SPACE } from "../../utils/StringConstants";
import { User } from "../../utils/user/User";
import CommandOptions from "../options/CommandOptions";
import AArgumentsCommand from "../templates/AArgumentsCommand";

const mainTrigger: string = "setTitle";

const rolesPermissions: Permissions<Role> = getModOnlyRolesPermissions();

const options: CommandOptions = new CommandOptions([
  "title",
  "updateTitle",
]).setRolesPermission(rolesPermissions);

export default class SetTitleCommand extends AArgumentsCommand {
  /* Character that separates effective title from common info at the end of your stream title
    For instance: My awesome let's play on TOTK ! | !game !death !socials
    In the above example we only want to change the left part of the title, before the "|" 
    */
  protected static TITLE_SEPARATOR = PIPE;

  constructor(enabled: boolean = true) {
    super(mainTrigger, options, enabled);
  }

  protected async executeWithArgs(
    user: User,
    chatMessage: ChatMessage,
    args: String[],
    ignoreCooldowns: boolean,
  ): Promise<void> {
    if (args.length === 0) {
      this.replyOrSend(
        user,
        chatMessage,
        ignoreCooldowns,
        "Essaie de trouver un titre avant de vouloir le changer...",
      );
      return;
    }

    var newTitle = args.join(SPACE);

    const currentTitle = await MainApp.twitchClient.getTitle();
    if (
      SetTitleCommand.TITLE_SEPARATOR &&
      SetTitleCommand.TITLE_SEPARATOR.length > 0 &&
      currentTitle.includes(SetTitleCommand.TITLE_SEPARATOR)
    ) {
      var index = currentTitle.indexOf(SetTitleCommand.TITLE_SEPARATOR);
      index =
        index > 0 && currentTitle[index - 1] === SPACE ? index - 1 : index;
      newTitle += currentTitle.slice(index);
    }

    const isTitleUpdated = await MainApp.getTwitchClient().setTitle(
      newTitle.trim(),
    );

    if (isTitleUpdated) {
      this.replyOrSend(
        user,
        chatMessage,
        ignoreCooldowns,
        `Titre changé pour: "${newTitle}" chef 👌`,
      );
    } else {
      this.replyOrSend(
        user,
        chatMessage,
        ignoreCooldowns,
        `Désolé, je ne peux pas mettre ce titre Sadge`,
      );
    }
  }
}
