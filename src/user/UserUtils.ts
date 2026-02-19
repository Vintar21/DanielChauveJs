import { Permissions } from "../utils/PermissionsUtils";
import { UserId } from "./User";
import { botsUser } from "./UserConstants";

// Allow everyone except registered bots (Moobot, Nightbot, streamelements)
export function getDefaultUsersPermissions(): Permissions<UserId> {
  const defaultUsersPermissions: Permissions<UserId> = new Permissions();
  defaultUsersPermissions.allowDefault();
  defaultUsersPermissions.unallowEach(botsUser.map((user) => user.userId));
  return defaultUsersPermissions;
}
