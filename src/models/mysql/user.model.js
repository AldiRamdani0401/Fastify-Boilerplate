import Database from "../../app/database.js";

export const UsersModel = Database.mysqlClient.user;

export const UserResponse = (user) => ({
  username: String(user.username),
  name: String(user.name),
  token: String(user.token),
});

export const CreateUserRequest = (user) => ({
  username: String(user.username),
  password: String(user.password),
  name: String(user.name),
  email: String(user.email),
  ...(user.phone && { phone: String(user.phone) }),
});

export const LoginUserRequest = (user) => ({
  username: String(user.username),
  password: String(user.password),
});
