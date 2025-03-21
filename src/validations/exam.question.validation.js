import { z } from "zod";

const ExamQuestionValidation = {
  CREATE_EXAM_QUESTION: z.object({
    exam_category: z
      .string()
      .min(10, "exam category length must be over 10 characters")
      .max(100, "exam category max 100 characters"),
    exam_sub_category: z
      .string()
      .min(10, "exam sub category length must be over 10 characters")
      .max(100, "exam sub category max 100 characters"),
    exam_type: z.enum(["multiple_choice", "essay"]),
    question: z
      .string()
      .min(5, "exam question length must be over 5 characters")
      .max(500, "exam question max 500 characters"),
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
  GET_EXAM_QUESTION: z.object({
    exam_category: z
      .string()
      .min(5, "exam category name length must be over 5 characters")
      .max(100, "exam category name max 100 characters"),
    exam_sub_category: z
      .string()
      .min(5, "exam sub category name length must be over 5 characters")
      .max(100, "exam sub category name max 100 characters"),
    id: z
      .number()
      .min(1, "exam sub category name length must be over 5 characters")
      .max(1000000, "exam sub category name max 1 million"),
  }),
  UPDATE_EXAM_QUESTION: z.object({
    params: z.object({
      exam_category: z
        .string()
        .min(5, "exam category name length must be over 5 characters")
        .max(100, "exam category name max 100 characters"),
      exam_sub_category: z
        .string()
        .min(5, "exam sub category name length must be over 5 characters")
        .max(100, "exam sub category name max 100 characters"),
      id: z
        .number()
        .min(1, "exam sub category name length must be over 5 characters")
        .max(1000000, "exam sub category name max 1 million"),
    }),
    datas: z.object({
      exam_type: z.enum(["multiple_choice", "essay"]),
      question: z
        .string()
        .min(5, "exam question length must be over 5 characters")
        .max(500, "exam question max 500 characters"),
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
  }),
};

export default ExamQuestionValidation;
