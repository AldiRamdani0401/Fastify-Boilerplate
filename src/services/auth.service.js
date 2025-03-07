import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";
import HashHandler from "../handlers/hash.handler.js";
import AuthValidation from "../validations/auth.validation.js";
import TokenHandler from "../handlers/token.handler.js";

import {
  RegisterUserRequest,
  LoginUserRequest,
  LogoutUserRequest,
  ChangePasswordRequest,
  UserResponse,
  UsersModel,
} from "../models/mysql/user.model.js";

const AuthService = {
  Register: async (user) => {
    user = RegisterUserRequest(user);
    const registerRequest = await Validation.validation(
      AuthValidation.REGISTER,
      user
    );

    const isDuplicate = await UsersModel.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (isDuplicate != 0) {
      ThrowError(400, "username already exists");
    }

    registerRequest.password = await HashHandler.generate(
      registerRequest.password
    );

    registerRequest.role = {
      connect: { role_name: registerRequest.role }, // Hubungkan ke role yang sudah ada
    };

    const result = await UsersModel.create({
      data: {
        ...registerRequest,
      },
    });

    return result;
  },

  Login: async (request) => {
    request = LoginUserRequest(request);
    request = await Validation.validation(AuthValidation.LOGIN, request);

    let user = await UsersModel.findUnique({
      where: {
        username: request.username,
      },
    });

    if (!user) ThrowError(400, "Username or Password is wrong");

    const isPasswordValid = await HashHandler.compare(
      request.password,
      user.password
    );

    if (!isPasswordValid) ThrowError(400, "Username or Password is wrong");

    user = await UsersModel.update({
      where: {
        username: request.username,
      },
      data: {
        token: await TokenHandler.generate(),
      },
    });

    const response = UserResponse(user);

    return response;
  },
  Logout: async (request) => {
    request = LogoutUserRequest(request);
    request = await Validation.validation(AuthValidation.LOGOUT, request);
    let result = await UsersModel.update({
      where: {
        username: request.username,
        token: request.token,
      },
      data: { token: null },
    });
    if (!result) ThrowError(401, "invalid or expired token");
    return true;
  },
  ChangePassword: async (request) => {
    request = ChangePasswordRequest(request);
    request = await Validation.validation(
      AuthValidation.CHANGE_PASSWORD,
      request
    );

    let user = await UsersModel.findUnique({
      where: {
        username: request.username,
        token: request.token,
      },
    });

    const isvalidPassword = await HashHandler.compare(
      request.oldPassword,
      user.password
    );

    if (!isvalidPassword) ThrowError(400);
    const newPassword = await HashHandler.generate(request.newPassword);

    await UsersModel.update({
      where: {
        username: request.username,
        token: request.token,
      },
      data: { password: newPassword },
    });
    return true;
  },
};

export default AuthService;
