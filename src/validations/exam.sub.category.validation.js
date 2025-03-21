import { z } from "zod";

const ExamSubCategoryValidation = {
  CREATE_EXAM_SUB_CATEGORY: z.object({
    category_name: z
      .string()
      .min(5, "exam category name length must be over 5 characters")
      .max(100, "exam category max 100 characters"),
    sub_category_name: z
      .string()
      .min(5, "exam sub category name length must be over 5 characters")
      .max(100, "exam sub category max 100 characters"),
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
  UPDATE_EXAM_SUB_CATEGORY: z.object({
    category_name: z
      .string()
      .min(5, "exam category name length must be over 5 characters")
      .max(100, "exam category name max 100 characters"),
    sub_category_name: z
      .string()
      .min(5, "exam sub category name length must be over 5")
      .max(100, "exam sub category name max 100 characters"),
    updated_data: z.object({
      category_name: z
        .string()
        .min(5, "exam category name length must be over 5 characters")
        .max(100, "exam category name max 100 characters")
        .optional(),
      sub_category_name: z
        .string()
        .min(5, "exam sub category name length must be over 5")
        .max(100, "exam sub category name max 100 characters")
        .optional(),
      owner: z
        .string()
        .min(5, "exam owner length must be over 5 characters")
        .max(100, "exam owner max 100 characters")
        .optional(),
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
  }),
};

export default ExamSubCategoryValidation;
