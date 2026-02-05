import CommandOptions from "../CommandOptions";
import { Roles } from "../../utils/RoleUtils";
import SimpleCommand from "../SimpleCommand";

export default class HelloCommand extends SimpleCommand {
  private static options: CommandOptions = new CommandOptions([
    /s+a*l+u*t+/i,
    /bo*n*jo*u*r+/i,
    /yo+/i,
    /we*sh/i,
    /co*u*co*u*/i,
    /he+l{2,}o+/,
  ])
    .setMaxUsePerUser(1)
    .setByPassRole(Roles.BROADCASTER)
    .setUnallowedRole(Roles.NO_ROLE)
    .disable();

  private static answer: string =
    "Salut le sang de la veine de l'artère aorte !";

  constructor() {
    super(HelloCommand.options, HelloCommand.answer);
  }
}
