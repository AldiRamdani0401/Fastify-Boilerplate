import Database from "../../app/database.js";

export const UsersModel = Database.mysqlClient.user;

// REQUEST //
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

export const GetUserRequest = (userId) => String(userId);

// RESPONSE //
export const UserResponse = (user) => ({
  username: String(user.username),
  name: String(user.name),
  token: String(user.token),
});

export const GetUserResponse = async (users) => {
  if (users.length > 2) {
    return await Promise.all(users.map((user) => {
      return {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
      };
    }));
  } else {
    return {
      name: users.name,
      username: users.username,
      email: users.email,
      phone: users.phone,
    };
  }
};
