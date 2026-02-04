import CommandOptions from "../CommandOptions";

export const danielOptions: CommandOptions = new CommandOptions().addTriggers([
  /daniel(chauve)?/i,
]);

export const danielAnswer: string = "Fais pas genre tu sais pas qui jsuis !";
