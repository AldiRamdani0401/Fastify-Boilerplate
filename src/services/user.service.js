import UserValidation from "../validations/user.validation.js";
import Validation from "../validations/validation.js";

const UserService = {
  findAll: async () => {
    // const error = new Error("Bad Request");
    // error.statusCode = 400; // Tambahkan status code ke error
    // throw error; // Lempar error ke middleware
    const users = [
      { id: "112233", name: "Aldi" },
      { id: "223344", name: "Hilda" },
      { id: "334455", name: "Amelia" },
    ];
    return users;
  },

  findById: async (userId) => {
    const findByIdRequest = await Validation.validation(UserValidation.FIND_BY_ID, {id: userId});
    const users = [
      { id: "112233", name: "Aldi" },
      { id: "223344", name: "Hilda" },
      { id: "334455", name: "Amelia" },
    ];
    const result = users.find((user) => user.id === findByIdRequest.id || null);
    return result;
  },
};

export default UserService;
