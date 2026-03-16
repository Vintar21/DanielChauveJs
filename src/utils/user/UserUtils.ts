import { Permissions } from "../permissions/Permissions";
import { botsUser, User, UserId } from "./User";

// Allow everyone except registered bots (Moobot, Nightbot, streamelements)
export function getDefaultUsersPermissions(): Permissions<UserId> {
  const defaultUsersPermissions: Permissions<UserId> = new Permissions();
  defaultUsersPermissions.allowDefault();
  defaultUsersPermissions.unallowEach(botsUser.map((user) => user.userId));
  return defaultUsersPermissions;
}

// TODO: change UserId for String
export const usersCache: Map<UserId, User> = new Map();
