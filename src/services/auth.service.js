import ThrowError from "../errors/throw.error.js";
import Validation from "../validations/validation.js";
import HashHandler from "../handlers/hash.handler.js";
import AuthValidation from "../validations/auth.validation.js";
import TokenHandler from "../handlers/token.handler.js";

import { CreateUserRequest, LoginUserRequest, UserResponse, UsersModel } from "../models/mysql/user.model.js";


const AuthService = {
  Register: async (user) => {
    user = CreateUserRequest(user);
    const registerRequest = await Validation.validation(AuthValidation.REGISTER, user);

    console.info(registerRequest);

    const isDuplicate = await UsersModel.count({
        where: {
            username: registerRequest.username
        }
    });

    if (isDuplicate != 0) {
        ThrowError(400, "username already exists");
    }

    registerRequest.password = await HashHandler.generate(registerRequest.password);

    const result = await UsersModel.create({
        data: registerRequest
    });

    return result;
  },

  Login: async (request) => {
    request = LoginUserRequest(request);
    const loginRequest = await Validation.validation(AuthValidation.LOGIN, request);

    let user = await UsersModel.findUnique({
        where: {
            username: loginRequest.username
        }
    });

    if (!user) ThrowError(400, "Username or Password is wrong");

    const isPasswordValid = await HashHandler.compare(loginRequest.password, user.password);


    if (!isPasswordValid) ThrowError(400, "Username or Password is wrong");

    user = await UsersModel.update({
        where: {
            username: loginRequest.username
        },
        data: {
            token: await TokenHandler.generate()
        }
    });

    const response = UserResponse(user);

    return response; 
  },
};

export default AuthService;
