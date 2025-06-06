import UserService from "../services/user.service.js";

import ResponseHandler from "../handlers/response.handler.js";

import {
  GetUserRequest,
  UpdateUserRequest,
} from "../models/mysql/user.model.js";
import FormHandler from "../handlers/form.handler.js";

const UserController = {
  // createUser: async (request, response) => {
  //   console.info(request.body);
  //   // const user = await UserService.create();
  // },
  getAllUsers: async (_, response) => {
    try {
      const requestTime = new Date().toISOString();
      const users = await UserService.findAll();
      ResponseHandler(response, {
        code: 200,
        datas: users,
        timeRequest: requestTime,
      });
    } catch (error) {
      return error;
    }
  },
  getUser: async (request, response) => {
    const requestTime = new Date().toISOString();
    let user = request.params.user;
    user = await UserService.find(user);

    if (!user) {
      ResponseHandler(response, {
        code: 404,
        message: "User Not Found",
        timeRequest: requestTime,
      });
    }

    ResponseHandler(response, {
      code: 200,
      datas: user,
      timeRequest: requestTime,
    });
  },
  updateUser: async (request, response) => {
    const requestTime = new Date().toISOString();
    let user = request.params.user;
    const updateData = await FormHandler(request);

    request = UpdateUserRequest(updateData);

    user = await UserService.update(user, request);

    ResponseHandler(response, {
      code: 200,
      datas: user,
      timeRequest: requestTime,
    });
  },
  deleteUser: async (request, response) => {
    let user = request.params.user;
    request = GetUserRequest(user);
    user = await UserService.delete(request);

    ResponseHandler(response, {
      code: 200,
      message: "User Deleted Successfully",
    });
  },
};

export default UserController;
