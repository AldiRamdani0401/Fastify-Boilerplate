import { z } from "zod";

const UserValidation = {
  FIND_USER: z.object({
    username: z
      .string()
      .min(6, "id be at least 6 character long")
      .max(100, "id max length: 100"),
  }),
  UPDATE: z.object({
    name: z.string().min(3).max(100).optional(),
    username: z.string().min(8).max(100).optional(),
    email: z.string().min(8).max(100).optional(),
    phone: z.string().min(10).max(13).optional(),
    file_profile_image: z.object({
      fieldname: z.string(),
      filename: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      buffer: z.instanceof(Buffer),
    }).optional(),
  }),
};

export default UserValidation;
