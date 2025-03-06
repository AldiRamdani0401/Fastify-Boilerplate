import { z } from "zod";

const AuthValidation = {
  LOGIN: z.object({
    username: z.string().min(8).max(100),
    password: z.string().min(8).max(100),
  }),
  REGISTER: z.object({
    name: z
      .string({ required_error: "name required" })
      .min(3, "name be at least 3 character long")
      .max(100, "name max length: 100"),
    username: z
      .string({ required_error: "username required" })
      .min(8, "username be at least 8 character long")
      .max(100, "username max length: 100"),
    password: z
      .string({ required_error: "password required" })
      .nonempty("password required")
      .min(8, "password be at least 8 character long")
      .max(100, "password max length: 100"),
    email: z
      .string({ required_error: "email required" })
      .min(8, "email be at least 8 character long")
      .max(100, "email max length: 100")
      .nonempty("email required"),
    phone: z
      .string()
      .min(10, "phone be at least 10 character long")
      .max(13, "phone max length: 13")
      .optional(),
  }),
};

export default AuthValidation;
