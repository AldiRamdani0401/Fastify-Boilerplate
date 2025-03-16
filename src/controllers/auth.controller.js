import FormHandler from "../handlers/form.handler.js";
import ResponseHandler from "../handlers/response.handler.js";

import AuthService from "../services/auth.service.js";

const AuthController = {
  register: async (request, response) => {
    try {
      const user = await FormHandler(request);
      const requestTime = new Date().toISOString();
      await AuthService.Register(user);
      ResponseHandler(response, {
        code: 201,
        message: "Register Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  login: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const user = await FormHandler(request);
      const result = await AuthService.Login(user);
      ResponseHandler(response, {
        code: 200,
        datas: result,
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  logout: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const user = request.body;
      await AuthService.Logout(user);
      ResponseHandler(response, {
        code: 200,
        message: "Logout Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
  changePassword: async (request, response) => {
    try {
      const requestTime = new Date().toISOString();
      const user = request.body;
      await AuthService.ChangePassword(user);
      ResponseHandler(response, {
        code: 200,
        message: "Change Password Successfully",
        timeRequest: requestTime,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default AuthController;
