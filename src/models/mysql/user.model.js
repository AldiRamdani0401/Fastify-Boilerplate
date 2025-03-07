import Database from "../../app/database.js";

export const UsersModel = Database.mysqlClient.user;

// REQUEST //
export const CreateUserRequest = (user) => ({
  ...(user.username && { username: String(user.username) }),
  ...(user.password && { password: String(user.password) }),
  ...(user.name && { name: String(user.name) }),
  ...(user.email && { email: String(user.email) }),
  ...(user.phone && { phone: String(user.phone) }),
  ...(user.role && { role: String(user.role) }),
});

export const RegisterUserRequest = (user) => ({
  ...(user.username && { username: String(user.username) }),
  ...(user.password && { password: String(user.password) }),
  ...(user.name && { name: String(user.name) }),
  ...(user.email && { email: String(user.email) }),
  ...(user.phone && { phone: String(user.phone) }),
  role: "user",
});

export const LoginUserRequest = (user) => ({
  ...(user.username && { username: String(user.username) }),
  ...(user.password && { password: String(user.password) }),
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
  };
};

export const UpdateUserResponse = async (user) => ({
  ...(user.username && { username: user.username }),
  ...(user.name && { name: user.name }),
  ...(user.email && { email: user.email }),
  ...(user.phone && { phone: user.phone }),
});
