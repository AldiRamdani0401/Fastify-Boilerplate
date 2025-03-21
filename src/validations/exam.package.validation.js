import { z } from "zod";

const ExamPackageValidation = {
  CREATE_EXAM_PACKAGE: z.object({
    exam_package_name: z
      .string()
      .min(5, "exam package name must be over 5 characters")
      .max(100, "exam package name max 100 characters"),
    owner: z.string().nonempty("owner must be defined"),
    admins: z.array(z.string()),
    exam_package_questions: z.array(
      z.object({
        exam_category: z.string(),
        exam_sub_category: z.string(),
      })
    ),
    max_duration: z
      .number()
      .min(10, "max duration must be over 10 minutes")
      .max(1440, "max duration must be less than or equal to 1440 minutes"),
  }),
  GET_EXAM_PACKAGE: z.object({
    exam_package_name: z
      .string()
      .min(5, "exam package name must be over 5 characters")
      .max(100, "exam package name max 100 characters"),
  }),
};

export default ExamPackageValidation;
