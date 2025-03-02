import { z } from "zod";

const UserValidation = {
  FIND_BY_ID: z.object({
    id: z
      .string()
      .min(6, "id be at least 6 character long")
      .max(10, "id max length: 10"),
  }),
};

export default UserValidation; 