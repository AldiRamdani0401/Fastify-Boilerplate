import { z } from "zod";

const UserValidation = {
  FIND_BY_ID: z.object({
    username: z
      .string()
      .min(6, "id be at least 6 character long")
      .max(100, "id max length: 100"),
  }),
};

export default UserValidation;
