import Database from "../../app/database";

export const RolesModel = Database.mysqlClient.role;

// REQUEST //
export const CreateRoleRequest = (role) => ({
  ...(role.role_name && { role_name: String(role.role_name) }),
  ...(role.manage_admin && { manage_admin: Boolean(role.manage_admin) }),
  ...(role.manage_user && { manage_user: Boolean(role.manage_user) }),
  ...(role.manage_file_user && {
    manage_file_user: Boolean(role.manage_file_user),
  }),
  ...(role.manage_file_users && {
    manage_file_users: Boolean(role.manage_file_users),
  }),
});

export const GetUserRoleRequest = (user) => ({
  ...(user.role_name && { role_name: String(user.role_name) }),
});

export const GetRolesRequest = (role) => ({
  ...(role.role_name && { role_name: String(role.role_name) }),
});

export const UpdateRoleRequest = (role) => ({
  ...(role.user_role && { user_role: String(role.user_role) }),
  ...(role.role_name && { role_name: String(role.role_name) }),
  ...(role.manage_admin && { manage_admin: Boolean(role.manage_admin) }),
  ...(role.manage_user && { manage_user: Boolean(role.manage_user) }),
  ...(role.manage_file_user && {
    manage_file_user: Boolean(role.manage_file_user),
  }),
  ...(role.manage_file_users && {
    manage_file_users: Boolean(role.manage_file_users),
  }),
});

export const DeleteRoleRequest = (role) => ({
  ...(role.user_role && { user_role: String(role.user_role) }),
  ...(role.role_name && { role_name: String(role.role_name) }),
});

// RESPONSE //
