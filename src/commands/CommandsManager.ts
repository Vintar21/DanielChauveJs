import { allMiscCommands, lastAddedCommands } from "./misc/AllMiscCommands";
import { allSimpleCommands } from "./simple/AllSimpleCommands";
import { allNoPrefixSimpleCommands } from "./simple/no-prefix/AllNoPrefixSimpleCommands";

import ICommand from "./ICommand";

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
    commands.forEach((command) => this.addCommand(command));
  }

  // Shouldn't init yourself, use getInstanceAndInit instead
  public init(): void {
    // Init only once
    if (CommandsManager.commands.length > 0) {
      return;
    }

    // Simple Commands
    this.addCommands(allSimpleCommands);

    // Misc Commands
    this.addCommands(allMiscCommands);

    // No Prefix Commands (last to be add)
    this.addCommands(allNoPrefixSimpleCommands);

    // Response to random message in chat (should be the last added)
    this.addCommands(lastAddedCommands);
  }
}
