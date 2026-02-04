import CommandOptions from "../../CommandOptions";

export const summaryOptions: CommandOptions = new CommandOptions().addTriggers([
  /r[éeêè]sum[éeêè]e?/i,
  /campagne/i,
  /histoire/i,
]);

export const summaryAnswer: string =
  "Retrouvez le résumé de la campagne ici: https://shorturl.at/owCWc 🐙";
