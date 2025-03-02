import UserService from "../services/user.service.js";

import ResponseHandler from "../handlers/response.handler.js";

const UserController = {
  getAllUsers: async (request, response) => {
    const users = await UserService.findAll();
    await ResponseHandler(response, { code: 200, datas: users });
  },
  getUserById: async (request, response) => {
    const userId = request.params.id;
    const user = await UserService.findById(userId);

    if (!user) await ResponseHandler(response, {code: 404, message: "User Not Found"});

    await ResponseHandler(response, { code: 200, datas: user });
  },
};

export default UserController;
