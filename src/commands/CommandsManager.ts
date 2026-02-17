import ICommand from "./ICommand";
import { allMiscCommands, lastAddedCommands } from "./misc/AllMiscCommands";
import { allMultipleAnswersCommands } from "./multiple-answers/AllMultipleAnswersCommands";
import { allSimpleCommands } from "./simple/AllSimpleCommands";
import { allNoPrefixSimpleCommands } from "./simple/no-prefix/AllNoPrefixSimpleCommands";

export default class CommandsManager {
  private static commands: Array<ICommand> = new Array<ICommand>();

  private static instance: CommandsManager = new CommandsManager();

  private constructor() {}

  public static getInstanceAndInit(): CommandsManager {
    CommandsManager.instance.init();
    return CommandsManager.instance;
  }

  public static getInstance(): CommandsManager {
    return CommandsManager.instance;
  }

  public getTriggeredCommand(message: string): ICommand | undefined {
    return CommandsManager.commands.find((command) => {
      return command.match(message);
    });
  }

  public addCommand(command: ICommand): void {
    CommandsManager.commands.push(command);
  }

  public addCommands(commands: Array<ICommand>): void {
    commands
      .filter((command) => command.isEnabled())
      .forEach((command) => this.addCommand(command));
  }

  // Shouldn't init yourself, use getInstanceAndInit instead
  protected init(): void {
    // Init only once
    if (CommandsManager.commands.length > 0) {
      return;
    }

    // Misc Commands (more used, so they're better first)
    this.addCommands(allMiscCommands);

    // Simple Commands
    this.addCommands(allSimpleCommands);

    // Multiple Answers Commands
    this.addCommands(allMultipleAnswersCommands);

    // this.addCommands(commands);

    // No Prefix Commands (last to be add)
    this.addCommands(allNoPrefixSimpleCommands);

    // Response to random message in chat (should be the last added)
    this.addCommands(lastAddedCommands);
  }
}
