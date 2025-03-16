import ThrowError from "../errors/throw.error.js";
import {
  CreateRoleRequest,
  GetRoleRequest,
  GetRoleResponse,
  GetRolesRequest,
  GetRolesResponse,
  UpdateRoleRequest,
  RolesModel,
} from "../models/mysql/role.model.js";
import { UsersModel } from "../models/mysql/user.model.js";
import RoleValidation from "../validations/role.validation.js";
import Validation from "../validations/validation.js";

const RoleService = {
  Create: async (role) => {
    role = CreateRoleRequest(role);
    const createRoleRequest = await Validation.validation(
      RoleValidation.CREATE,
      role
    );

    const isDuplicated = await RolesModel.findUnique({
      where: {
        role_name: role.role_name,
      },
    });

    if (isDuplicated) {
      ThrowError(400, "Role Name Already Exists");
    }

    const result = await RolesModel.create({
      data: {
        ...createRoleRequest,
      },
    });

    return result;
  },
  findAll: async (request) => {
    request = GetRolesRequest(request);

    const totalRoles = await RolesModel.findMany();
    const totalPage = Math.ceil(totalRoles.length / request.limit);

    const where = {};

    if (request.filter) {
      where[request.filter] = request.filter;
    }

    if (request.search) {
      where[request.search] = request.search;
    }

    const roles = await RolesModel.findMany({
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      ...(Object.keys(where).length > 0 && { where }),
      orderBy: {
        role_name: request.order,
      },
    });

    roles.totalPage = totalPage;
    roles.totalDatas = roles.length;

    const result = await GetRolesResponse(roles);
    return result;
  },
  find: async (request) => {
    request = GetRoleRequest(request);

    request = await Validation.validation(RoleValidation.FIND_ROLE, request);

    let result = await RolesModel.findUnique({
      where: {
        role_name: request.role_name,
      },
    });

    const users = await UsersModel.findMany({
      where: {
        roleId: request.role_name,
      },
    });

    result = GetRoleResponse(result, users);

    if (!result) {
      ThrowError(404, "Role Not Found");
    }

    return result;
  },
  update: async (request) => {
    request = UpdateRoleRequest(request);

    const updateRoleRequest = await Validation.validation(
      RoleValidation.UPDATE,
      request
    );

    const isRoleExists = await RolesModel.findUnique({
      where: {
        role_name: request.param,
      },
    });

    if (!isRoleExists) {
      ThrowError(404, "Role Not Found");
    }

    const result = await RolesModel.update({
      where: {
        role_name: request.param,
      },
      data: {
        ...updateRoleRequest,
      },
    });

    if (!result) {
      ThrowError(400);
    }

    await UsersModel.updateMany({
      where: {
        roleId: request.role_name,
      },
      data: {
        roleId: request.role_name,
      },
    });

    return result;
  },
  delete: async (request) => {
    request = await Validation.validation(RoleValidation.FIND_ROLE, request);

    await UsersModel.updateMany({
      where: {
        roleId: request.role_name,
      },
      data: {
        roleId: "user",
      },
    });

    const result = await RolesModel.delete({
      where: {
        role_name: request.role_name,
      },
    });

    if (!result) {
      ThrowError(400);
    }

    return result;
  },
};

export default RoleService;
