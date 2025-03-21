import { z } from "zod";

const ExamEventValidation = {
  CREATE_EXAM_EVENT: z.object({
    exam_event_name: z
      .string()
      .min(5, "exam event name length must be over 5 characters")
      .max(100, "exam event name max 100 characters"),
    exam_package_id: z
      .string()
      .min(5, "exam package id length must be over 5 characters")
      .max(100, "exam package id max 100 characters"),
    owner: z
      .string()
      .min(5, "owner name length must be over 5 characters")
      .max(100, "owner name max 100 characters"),
    admins: z.array(z.string().min(1, "each admin must be a non-empty string")),
    proctors: z.array(
      z.string().min(1, "each proctor must be a non-empty string")
    ),
    examinees: z.array(
      z.string().min(1, "each examinee must be a non-empty string")
    ),
    start_time: z.string().refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date format, must be a valid timestamp",
      }
    ),
    end_time: z.string().refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date format, must be a valid timestamp",
      }
    ),
  }),
};

export default ExamEventValidation;
