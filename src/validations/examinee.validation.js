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
      exam_category: z
        .string()
        .min(5, "Exam Category must be over 5 characters")
        .max(100, "Exam Category max 100 characters"),
    }),
    datas: z.object({
      start_exam: z.boolean(),
      start_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Start time must be a valid ISO format",
      }),
    }),
  }),

  SUBMIT_EXAM: z.object({
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
      exam_category: z
        .string()
        .min(5, "Exam Category must be over 5 characters")
        .max(100, "Exam Category max 100 characters"),
    }),
    datas: z.object({
      examinee_sheet_id: z.number().min(1),
      exam_event_name: z
        .string()
        .min(5, "Exam event name must be over 5 characters")
        .max(100, "Exam event name max 100 characters"),
      examinee_id: z
        .string()
        .min(5, "Exam package ID must be over 5 characters")
        .max(100, "Exam package ID max 100 characters"),
      examinee_name: z
        .string()
        .min(5, "Examinee name must be over 5 characters")
        .max(100, "Examinee name max 100 characters"),
      exam_category: z
        .string()
        .min(5, "Exam Category must be over 5 characters")
        .max(100, "Exam Category max 100 characters"),
      exam_sub_category: z
        .string()
        .min(5, "Exam Sub Category must be over 5 characters")
        .max(100, "Exam Sub Category max 100 characters"),
      examinee_exam_status: z.string().refine(
        (value) => {
          if (value === "true" || value === "ongoing" || value === "false") {
            return value;
          }
        },
        {
          message: "Invalid Examinee Exam Status Value",
        }
      ),
      start_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Start time must be a valid ISO format",
      }),
      finished_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Finish time must be a valid ISO format",
      }),
      examinee_exam_sheet: z.array(
        z.object({
          id: z.number(),
          exam_type: z.string(),
          exam_category: z.string(),
          exam_sub_category: z.string(),
          examinee_answer: z.array(z.any()),
        })
      ),
    }),
  }),
};

export default ExamineesValidation;
