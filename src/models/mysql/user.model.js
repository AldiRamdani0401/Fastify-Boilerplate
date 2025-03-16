import Database from "../../app/database.js";
import { Mandatory } from "../../utils/types.js";

export const UsersModel = Database.mysqlClient.user;

// REQUEST //
export const CreateUserRequest = (user) => ({
  username: String(Mandatory(user?.username, "Username")),
  password: String(Mandatory(user?.password, "Password")),
  name: String(Mandatory(user?.name, "Name")),
  email: String(Mandatory(user?.email, "Email")),
  ...(user?.phone && { phone: String(user?.phone) }),
  role: String(Mandatory(user?.role, "Role")),
});

export const RegisterUserRequest = (user) => ({
  username: String(Mandatory(user?.username, "Username")),
  password: String(Mandatory(user?.password, "Password")),
  name: String(Mandatory(user?.name, "Name")),
  email: String(Mandatory(user?.email, "Email")),
  ...(user?.phone && { phone: String(user?.phone) }),
  role: "user",
});

export const LoginUserRequest = (user) => ({
  username: String(Mandatory(user?.username, "Username")),
  password: String(Mandatory(user?.password, "Password")),
});

export const LogoutUserRequest = (user) => ({
  ...(user.username && { username: String(user.username) }),
  ...(user.token && { token: String(user.token) }),
});

export const ChangePasswordRequest = (user) => ({
  ...(user.username && { username: String(user.username) }),
  ...(user.token && { token: String(user.token) }),
  ...(user.oldPassword && { oldPassword: String(user.oldPassword) }),
  ...(user.newPassword && { newPassword: String(user.newPassword) }),
});

export const GetUserRequest = (userId) => String(userId);

export const UpdateUserRequest = (user) => ({
  ...(user.username && { username: String(user.username) }),
  ...(user.name && { name: String(user.name) }),
  ...(user.email && { email: String(user.email) }),
  ...(user.phone && { phone: String(user.phone) }),
  ...(user.files.length > 0 && {
    profile_image: String(user.files[0].filename),
  }),
  ...(user.files.length > 0 && {
    file_profile_image: Object(user.files[0]),
  }),
});

// RESPONSE //
export const UserResponse = (user) => ({
  username: String(user.username),
  ...(user.name && { name: String(user.name) }),
  ...(user.token && { token: String(user.token) }),
});

export const GetUsersResponse = async (users) => {
  return await Promise.all(
    users.map((user) => {
      return {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.roleId,
      };
    })
  );
};

export const GetUserResponse = async (user) => {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    profile_image: user.profile_image,
  };
};

export const UpdateUserResponse = async (user) => ({
  name: user.name,
  username: user.username,
  email: user.email,
  phone: user.phone,
  profile_image: user.profile_image,
});
