import ThrowError from "../errors/throw.error.js";
import {
  GetUserRequest,
  GetUserResponse,
  UsersModel,
} from "../models/mysql/user.model.js";
import UserValidation from "../validations/user.validation.js";
import Validation from "../validations/validation.js";

const UserService = {
  findAll: async () => {
    const users = await UsersModel.findMany();
    const result = await GetUserResponse(users);
    return result;
  },

  findById: async (userId) => {
    userId = GetUserRequest(userId);
    const findByIdRequest = await Validation.validation(
      UserValidation.FIND_BY_ID,
      { username: userId }
    );

    const user = await UsersModel.findUnique({
      where: {
        username: findByIdRequest.username,
      },
    });

    if (!user) {
      ThrowError(404, "User Not Found");
    }

    const result = await GetUserResponse(user);
    return result;
  },

  update: async (userId) => {
    userId = GetUserRequest(userId);
    const findByIdRequest = await Validation.validation(
      UserValidation.FIND_BY_ID,
      { username: userId }
    );

    const user = await UsersModel.findUnique({
      where: {
        username: findByIdRequest.username,
      },
    });

    if (!user) {
      ThrowError(404, "User Not Found");
    }

    const result = await GetUserResponse(user);
    return result;
  },
};

export default UserService;
