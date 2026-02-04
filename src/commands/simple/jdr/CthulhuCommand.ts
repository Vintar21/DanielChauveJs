import CommandOptions from "../../CommandOptions";

export const cthulhuOptions: CommandOptions = new CommandOptions().addTriggers([
  /ch?th?uh?lh?uh?/i,
]);

export const cthulhuAnswer: string =
  "L'appel de Cthulhu est un JdR enquête/horreur se plaçant dans les USA des années 1920. Nos protagonistes ont pour but d'investiguer sur des faits étranges aux quatre coins du pays et de régler les soucis en toute discrétion. On joue avec des dés 100 qui représente un pourcentage de réussite: 1 est un succès critique et de 96 à 100 un échec critique !";
