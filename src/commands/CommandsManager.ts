import { MainApp } from "../app";
import { SPACE } from "../utils/StringConstants";
import {
  allCounterCommands,
  allMiscCommands,
  allMultipleAnswersCommands,
  allNoPrefixSimpleCommands,
  allSimpleCommands,
  lastAddedCommands,
  pollCommand,
} from "./AllCommands";
import ICommand from "./templates/ICommand";

export default class CommandsManager {
  commandsMap: Map<string, ICommand> = new Map();

  private static instance: CommandsManager = new CommandsManager();

  private constructor() {}

  public static getInstanceAndInit(): CommandsManager {
    CommandsManager.instance.init();
    return CommandsManager.instance;
  }

  public static getInstance(): CommandsManager {
    return CommandsManager.instance;
  }

  public async getTriggeredCommand(
    message: string,
    game: string,
  ): Promise<ICommand | undefined> {
    const firstWord = message.split(SPACE)[0].normalize().toLowerCase();
    const potentialCommand = this.commandsMap.get(firstWord);

    // recheck with match because of game conditions TODO: change that
    if (potentialCommand && potentialCommand.match(message, game)) {
      return potentialCommand;
    }

    return Array.from(this.commandsMap.values()).find((command) =>
      command.match(message, game),
    );
  }

  public addCommand(command: ICommand): void {
    command
      .getAllStringTriggers()
      .forEach((trigger) =>
        this.commandsMap.set(trigger.trim().normalize().toLowerCase(), command),
      );
  }

  public addCommands(commands: Array<ICommand>): void {
    commands
      .filter((command) => command.isEnabled())
      .forEach((command) => this.addCommand(command));
  }

  // Shouldn't init yourself, use getInstanceAndInit instead
  protected init(): void {
    // Init only once
    if (this.commandsMap.size > 0) {
      this.commandsMap.forEach((command) => command.reset());
      return;
    }

    // Init commands Listeners here FIXME: not a good practice
    pollCommand.initListener();

    // Misc Commands (more used, so they're better first)
    this.addCommands(allMiscCommands);

    // Simple Commands
    this.addCommands(allSimpleCommands);

    // Multiple Answers Commands
    this.addCommands(allMultipleAnswersCommands);

    // Counters Commands
    this.addCommands(allCounterCommands);

    // this.addCommands(commands);

    // No Prefix Commands (last to be add)
    this.addCommands(allNoPrefixSimpleCommands);

    // Response to random message in chat (should be the last added)
    this.addCommands(lastAddedCommands);

    // Import commands from GSheet
    MainApp.getGoogleSheetManager().importSimpleCommands();
  }
}
