import { z } from "zod";

const AdminExamValidation = {
  ADMIN_FIND_EXAM_EVENTS: z.object({
    admins: z
      .string()
      .min(5, "Admin ID must be over 5 characters")
      .max(100, "Admin ID max 100 characters"),
  }),
};

export default AdminExamValidation;
