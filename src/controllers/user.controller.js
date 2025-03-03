import UserService from "../services/user.service.js";

import ResponseHandler from "../handlers/response.handler.js";

const UserController = {
  createUser: async (request, response) => {
    console.info(request.body);
    // const user = await UserService.create();
  },
  getAllUsers: async (request, response) => {
    const users = await UserService.findAll();
    ResponseHandler(response, { code: 200, datas: users });
  },
  getUserById: async (request, response) => {
    const userId = request.params.id;
    const user = await UserService.findById(userId);

    if (!user) ResponseHandler(response, { code: 404, message: "User Not Found" });
    
    ResponseHandler(response, { code: 200, datas: user });
  },
};

export default UserController;
