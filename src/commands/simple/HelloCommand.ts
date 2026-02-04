import CommandOptions from "../CommandOptions";
import { Roles } from "../../utils/RoleUtils";

export const helloOptions: CommandOptions = new CommandOptions()
  .addTriggers([
    /s+a*l+u*t+/i,
    /bo*n*jo*u*r+/i,
    /yo+/i,
    /we*sh/i,
    /co*u*co*u*/i,
    /he+l{2,}o+/,
  ])
  .setMaxUsePerUser(1)
  .setByPassRole(Roles.BROADCASTER)
  .setUnallowedRole(Roles.NO_ROLE);

export const helloAnswer: string =
  "Salut le sang de la veine de l'artère aorte !";
