import { z } from "zod";

const ExamValidation = {
  CREATE_EXAM: z.object({
    exam_category: z
      .string()
      .min(10, "exam category length must be over 10 characters")
      .max(100, "exam category max 100 characters"),
    exam_sub_category: z
      .string()
      .min(10, "exam sub category length must be over 10 characters")
      .max(100, "exam sub category max 100 characters"),
    exam_type: z.enum(["multiple_choice", "essay"]),
    field: z.string(),
    answers: z.array(z.any()).refine(
      (answers) => {
        return (
          Array.isArray(answers) &&
          answers.every((answer) => typeof answer !== "undefined")
        );
      },
      {
        message: "Each answer must be defined and should be an array",
      }
    ),
  }),
};

export default ExamValidation;
