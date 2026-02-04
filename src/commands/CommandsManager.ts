import SimpleCommand from "../commands/SimpleCommand";
import { SPACE } from "../utils/StringConstants";
import ICommand from "./ICommand";
import { danielAnswer, danielOptions } from "./simple/DanielCommand";
import { helloAnswer, helloOptions } from "./simple/HelloCommand";
import { gianniAnswer, gianniOptions } from "./simple/jdr/GianniCommand";
import { gustaveAnswer, gustaveOptions } from "./simple/jdr/GustaveCommand";
import { marlaAnswer, marlaOptions } from "./simple/jdr/MarlaCommand";
import { martaAnswer, martaOptions } from "./simple/jdr/MartaCommand";
import { michelAnswer, michelOptions } from "./simple/jdr/MichelCommand";
import { peterAnswer, peterOptions } from "./simple/jdr/PeterCommand";
import { sidoniaAnswer, sidoniaOptions } from "./simple/jdr/SidoniaCommand";
import { thelmaAnswer, thelmaOptions } from "./simple/jdr/ThelmaCommand";
import {
  ouaisOuaisOuaisAnswer,
  ouaisOuaisOuaisOptions,
} from "./simple/OuaisOuaisOuaisCommand";
import {
  shittyGameAnswer,
  shittyGameOptions,
} from "./simple/ShittyGameCommand";
import {
  switchFriendCodeAnswer,
  switchFriendCodeOptions,
} from "./simple/SwitchFriendCodeCommand";

export default class CommandsManager {
  private static commands: Array<ICommand> = new Array<ICommand>();

  private static instance: CommandsManager = new CommandsManager();

  private constructor() {}

  public static getInstance(): CommandsManager {
    return CommandsManager.instance;
  }

  public getTriggeredCommand(message: string): ICommand | undefined {
    const parts = message.toLowerCase().split(SPACE);
    return CommandsManager.commands.find((command) => {
      return command.match(parts[0]);
    });
  }

  public addCommand(command: ICommand): void {
    CommandsManager.commands.push(command);
  }

  public init(): void {
    // Hello (dummy test command)
    const helloCommand: SimpleCommand = new SimpleCommand(
      helloOptions,
      helloAnswer,
    );
    this.addCommand(helloCommand);

    const ouaisOuaisOuaisCommand: SimpleCommand = new SimpleCommand(
      ouaisOuaisOuaisOptions,
      ouaisOuaisOuaisAnswer,
    );
    this.addCommand(ouaisOuaisOuaisCommand);

    const danielCommand: SimpleCommand = new SimpleCommand(
      danielOptions,
      danielAnswer,
    );
    this.addCommand(danielCommand);

    const shittyGameCommand: SimpleCommand = new SimpleCommand(
      shittyGameOptions,
      shittyGameAnswer,
    );
    this.addCommand(shittyGameCommand);

    const switchFriendCodeCommand: SimpleCommand = new SimpleCommand(
      switchFriendCodeOptions,
      switchFriendCodeAnswer,
    );
    this.addCommand(switchFriendCodeCommand);

    const jdrCommands = [
      new SimpleCommand(gianniOptions, gianniAnswer),
      new SimpleCommand(gustaveOptions, gustaveAnswer),
      new SimpleCommand(marlaOptions, marlaAnswer),
      new SimpleCommand(martaOptions, martaAnswer),
      new SimpleCommand(michelOptions, michelAnswer),
      new SimpleCommand(peterOptions, peterAnswer),
      new SimpleCommand(sidoniaOptions, sidoniaAnswer),
      new SimpleCommand(thelmaOptions, thelmaAnswer),
    ];
    jdrCommands.forEach((command) => this.addCommand(command));
  }
}
