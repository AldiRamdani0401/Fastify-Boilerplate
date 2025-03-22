import { z } from "zod";

const ExamineesValidation = {
  CREATE_EXAMINEES: z.array(
    z.object({
      examinee_name: z
        .string()
        .min(5, "Examinee name must be over 5 characters")
        .max(100, "Examinee name max 100 characters"),
      examinee_category: z
        .string()
        .min(5, "Examinee category must be over 5 characters")
        .max(100, "Examinee category max 100 characters"),
    })
  ),

  GET_EXAMINEE: z.object({
    examinee_id: z
      .string()
      .length(100, "Examinee ID must be exactly 100 characters"),
  }),

  UPDATE_EXAMINEE: z.object({
    param: z.object({
      examinee_id: z
        .string()
        .length(100, "Examinee ID must be exactly 100 characters"),
    }),
    datas: z.object({
      examinee_name: z
        .string()
        .min(5, "Examinee name must be over 5 characters")
        .max(100, "Examinee name max 100 characters")
        .optional(),
      examinee_category: z
        .string()
        .min(5, "Examinee category must be over 5 characters")
        .max(100, "Examinee category max 100 characters")
        .optional(),
    }),
  }),

  GET_EXAMINEE_EVENT: z.object({
    examinee_id: z
      .string()
      .length(100, "Examinee ID must be exactly 100 characters"),
    exam_event_name: z
      .string()
      .min(5, "Exam event name must be over 5 characters")
      .max(100, "Exam event name max 100 characters"),
  }),

  START_EXAM: z.object({
    params: z.object({
      examinee_id: z
        .string()
        .length(100, "Examinee ID must be exactly 100 characters"),
      exam_event_name: z
        .string()
        .min(5, "Exam event name must be over 5 characters")
        .max(100, "Exam event name max 100 characters"),
      exam_package_id: z
        .string()
        .min(5, "Exam package ID must be over 5 characters")
        .max(100, "Exam package ID max 100 characters"),
    }),
    datas: z.object({
      start_exam: z.boolean(),
      start_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Start time must be a valid ISO format",
      }),
    }),
  }),
};

export default ExamineesValidation;
