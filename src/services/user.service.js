import ThrowError from "../errors/throw.error.js";
import {
  GetUserRequest,
  GetUserResponse,
  GetUsersResponse,
  UpdateUserResponse,
  UsersModel,
} from "../models/mysql/user.model.js";
import UserValidation from "../validations/user.validation.js";
import Validation from "../validations/validation.js";

const UserService = {
  findAll: async () => {
    const users = await UsersModel.findMany();
    const result = await GetUsersResponse(users);
    return result;
  },

  find: async (user) => {
    user = GetUserRequest(user);
    const findByIdRequest = await Validation.validation(
      UserValidation.FIND_USER,
      { username: user }
    );

    user = await UsersModel.findUnique({
      where: {
        username: findByIdRequest.username,
      },
    });

    if (!user) {
      return ThrowError(404, "User Not Found");
    }

    const result = await GetUserResponse(user);
    return result;
  },

  update: async (user, request) => {
    user = { username: GetUserRequest(user) };
    const updateRequest = await Validation.validation(
      UserValidation.UPDATE,
      request
    );

    if (updateRequest.name) user.name = updateRequest.name;
    if (updateRequest.username) user.username = updateRequest.username;
    if (updateRequest.email) user.email = updateRequest.email;
    if (updateRequest.phone) user.phone = updateRequest.phone;

    user = await UsersModel.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    user = await UpdateUserResponse(user);

    return user;
  },

  delete: async (request) => {
    request = GetUserRequest(request);
    request = await Validation.validation(UserValidation.FIND_USER, {
      username: request,
    });

    const result = await UsersModel.delete({
      where: {
        username: request.username,
      },
    });

    return result;
  },
};

export default UserService;
