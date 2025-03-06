import ResponseHandler from "../handlers/response.handler.js";
import AuthService from "../services/auth.service.js";

const AuthController = {
  register: async (request, response) => {
    try {
      const user = request.body;
      await AuthService.Register(user);
      ResponseHandler(response, {
        code: 201,
        message: "Register Successfully",
      });
    } catch (error) {
      return error;
    }
  },
  login: async (request, response) => {
    try {
      const user = request.body;
      const result = await AuthService.Login(user);
      ResponseHandler(response, { code: 200, datas: result });
    } catch (error) {
      return error;
    }
  },
  logout: async (request, response) => {
    try {
      const user = request.body;
      await AuthService.Logout(user);
      ResponseHandler(response, { code: 200, message: "Logout Successfully" });
    } catch (error) {
      return error;
    }
  },
  changePassword: async (request, response) => {
    try {
      const user = request.body;
      await AuthService.ChangePassword(user);
      ResponseHandler(response, {
        code: 200,
        message: "Change Password Successfully",
      });
    } catch (error) {
      return error;
    }
  },
};

export default AuthController;
