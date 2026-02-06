import { Roles } from "../../utils/RoleUtils";
import CommandOptions from "../CommandOptions";
import SimpleCommand from "../templates/SimpleCommand";

const options: CommandOptions = new CommandOptions([
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

const answer: String = "Salut le sang de la veine de l'artère aorte !";

export default class HelloCommand extends SimpleCommand {
  constructor(enabled: boolean = true) {
    super(options, answer, enabled);
  }
}
