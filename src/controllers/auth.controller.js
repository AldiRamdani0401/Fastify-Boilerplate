import ResponseHandler from "../handlers/response.handler.js";
import AuthService from "../services/auth.service.js";

const AuthController = {
  register: async (request, response) => {
    try {
      const user = request.body;
      await AuthService.Register(user);
      ResponseHandler(response, { code:200, message: "Register Successfully" });
    } catch (error) {
      return error;
    }
  },
  login: async (request, response) => {
    try {
      const user = request.body;
      const result = await AuthService.Login(user);
      ResponseHandler(response, { code:200, datas: result });
    } catch (error) {
      return error;
    }
  },
};

export default AuthController;
