import CommandOptions from "../CommandOptions";

export const ouaisOuaisOuaisOptions: CommandOptions =
  new CommandOptions().addTriggers([/(oua(is?|é|e)\s*){3}/i]);

export const ouaisOuaisOuaisAnswer: string = "Ouais ouais ouais !";
