import { z } from "zod";

const ExamValidation = {
  CREATE: z.object({
    exam_category: z
      .string()
      .min(10, "exam category length must be over 10 characters")
      .max(100, "exam category max 100 characters"),
    exam_type: z.enum(["multiple_choice", "essay"]),
    field: z.string(),
    answers: z.array(z.array(z.any())).refine(
      (answers) => {
        return (
          Array.isArray(answers) &&
          answers.every(
            (answerArray) =>
              Array.isArray(answerArray) &&
              answerArray.every((answer) => typeof answer !== "undefined")
          )
        );
      },
      {
        message: "Each answer must be defined and should be an array of arrays",
      }
    ),
  }),
};

export default ExamValidation;
