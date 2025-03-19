import { z } from "zod";

const ExamCategoryValidation = {
  CREATE_EXAM_CATEGORY: z.object({
    category_name: z
      .string()
      .min(5, "exam category name length must be over 5 characters")
      .max(100, "exam category max 100 characters"),
    owner: z
      .string()
      .min(5, "exam owner length must be over 5 characters")
      .max(100, "exam owner max 100 characters"),
    admins: z
      .array(z.string())
      .refine(
        (admins) => {
          return (
            Array.isArray(admins) &&
            admins.every((admin) => typeof admin === "string")
          );
        },
        {
          message: "Each admin must be a string",
        }
      )
      .optional(),
  }),
  GET_EXAM_CATEGORY: z.object({
    category_name: z
      .string()
      .min(5, "exam category name length must be over 5 characters")
      .max(100, "exam category max 100 characters"),
  }),
};

export default ExamCategoryValidation;
