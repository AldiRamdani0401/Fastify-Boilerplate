import Database from "../../app/database.js";

export const RolesModel = Database.mysqlClient.role;

// REQUEST //
export const CreateRoleRequest = (role) => ({
  role_name: String(role.role_name),
  manage_admin: Boolean(role.manage_admin),
  manage_user: Boolean(role.manage_user),
  manage_users: Boolean(role.manage_users),
  manage_file_user: Boolean(role.manage_file_user),
  manage_file_users: Boolean(role.manage_file_users),
  manage_roles: Boolean(role.manage_roles),
});

export const GetRoleRequest = (roleName) => ({
  role_name: String(roleName),
});

export const GetRolesRequest = (request) => ({
  page: Number(request.query.page?.replace(/^['"]+|['"]+$/g, "").trim() ?? 1),
  limit: Number(
    request.query.limit?.replace(/^['"]+|['"]+$/g, "").trim() ?? 10
  ),
  ...(request.query.search && {
    search: String(request.query.search)
      .replace(/^['"]+|['"]+$/g, "")
      .trim(),
  }),
  ...(request.query.filter && {
    filter: String(request.query.filter)
      .replace(/^['"]+|['"]+$/g, "")
      .trim(),
  }),
  ...(request.query.order && {
    order: (() => {
      const order = Number(
        request.query.order.replace(/^['"]+|['"]+$/g, "").trim()
      );
      if (order === 1) return "asc";
      if (order === 2) return "desc";
      return undefined;
    })(),
  }),
});

export const UpdateRoleRequest = (request) => ({
  param: String(request.params.role),
  ...(request.body.role_name && { role_name: String(request.body.role_name) }),
  ...(request.body.manage_admin && {
    manage_admin: Boolean(request.body.manage_admin),
  }),
  ...(request.body.manage_user && {
    manage_user: Boolean(request.body.manage_user),
  }),
  ...(request.body.manage_users && {
    manage_users: Boolean(request.body.manage_users),
  }),
  ...(request.body.manage_file_user && {
    manage_file_user: Boolean(request.body.manage_file_user),
  }),
  ...(request.body.manage_file_users && {
    manage_file_users: Boolean(request.body.manage_file_users),
  }),
  ...(request.body.manage_roles && {
    manage_roles: Boolean(request.body.manage_roles),
  }),
});

export const DeleteRoleRequest = (role) => ({
  ...(role.user_role && { user_role: String(role.user_role) }),
  ...(role.role_name && { role_name: String(role.role_name) }),
});

// RESPONSE //
export const GetRolesResponse = async (roles) => {
  const datas = roles.map((role) => {
    return {
      role_name: role.role_name,
      manage_admin: role.manage_admin,
      manage_user: role.manage_user,
      manage_users: role.manage_users,
      manage_file_user: role.manage_file_user,
      manage_file_users: role.manage_file_users,
      manage_roles: role.manage_roles,
    };
  });

  return {
    roles: datas,
    total_page: Number(roles.totalPage),
    total_datas: Number(roles.totalDatas),
  };
};

export const GetRoleResponse = async (role, users) => {
  users = users.map((user) => {
    return {
      username: user.username,
      name: user.name,
    };
  });

  return {
    role,
    users: users,
  };
};
