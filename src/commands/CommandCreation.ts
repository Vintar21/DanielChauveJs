import CommandOptions from "./options/CommandOptions";
import ICommand from "./templates/ICommand";
import SimpleCommand from "./templates/SimpleCommand";

// Not sure to keep this file, it's a draft

export const commands: Array<ICommand> = [];

/* 1. Copy this template
 * 2. Rename myCommand with an appropriate name
 * 3. Change the regex in CommandOptions to match the command you want to create (without the prefix)
 *   3.1 If you don't know about regex, just use simple text like [/mycommand/i] to match "!mycommand" (case insensitive) or check regex101.com for more complex regex
 * 4. Adapt the CommandOptions if needed. You have:
 *   - Global and user cooldowns
 *   - Roles permissions
 *   - Max use per user and global
 *   - Reply to user or not
 *   ... (see CommandOptions or some of the example commands for more details)
 * 5. Change the answer of the command in the second parameter of the SimpleCommand constructor
 * 6. To quickly disable a command, change the last parameter from true to false
 * 7. Don't forget to update the commands.push
 *
 * Note: If you need more complex/specific commands, change SimpleCommand by something else (see other example commands or create your own template by extending ACommand like in src/commands/misc)
 */
const myCommand: ICommand = new SimpleCommand(
  "myCommand",
  new CommandOptions([/thecomm?and/i]).setGlobalCooldown(10),
  "This is an example command answer.",
  true,
);
commands.push(myCommand);

// TODO: MultipleAnswersCommand

// TODO: CountersCommand

// TODO: MiscCommand
