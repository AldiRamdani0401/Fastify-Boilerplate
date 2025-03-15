import ResponseHandler from "../handlers/response.handler.js";
import RoleService from "../services/role.service.js";

const RoleController = {
  createRole: async (request, response) => {
    try {
      const role = request.body;
      const requestTime = new Date().toISOString();
      const result = await RoleService.Create(role);
      ResponseHandler(response, {
        code: 201,
        message: "New Role Created",
        timeRequest: requestTime,
        datas: result,
      });
    } catch (error) {
      throw error;
    }
  },
  getAllRoles: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const roles = await RoleService.findAll(request);
      ResponseHandler(response, {
        code: 200,
        datas: roles,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  getRole: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const role = await RoleService.find(request.params.role);
      ResponseHandler(response, {
        code: 200,
        datas: role,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  updateRole: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const role = await RoleService.update(request);
      ResponseHandler(response, {
        code: 200,
        datas: role,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default RoleController;
