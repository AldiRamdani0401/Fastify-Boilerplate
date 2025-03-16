import { z } from "zod";

const RoleValidation = {
  CREATE: z.object({
    role_name: z
      .string()
      .min(3, { message: "role name length must be over 3 characters" })
      .max(100, { message: "role name max 100 characters" }),
    manage_admin: z.boolean().refine((val) => val === true || val === false, {
      message: "manage_admin must be true or false",
    }),
    manage_user: z.boolean().refine((val) => val === true || val === false, {
      message: "manage_user must be true or false",
    }),
    manage_users: z.boolean().refine((val) => val === true || val === false, {
      message: "manage_user must be true or false",
    }),
    manage_file_user: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_file_user must be true or false",
      }),
    manage_file_users: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_file_users must be true or false",
      }),
    manage_roles: z.boolean().refine((val) => val === true || val === false, {
      message: "manage_roles must be true or false",
    }),
  }),
  FIND_ROLE: z.object({
    role_name: z
      .string()
      .min(3, { message: "role name length must be over 3 characters" })
      .max(100, { message: "role name max 100 characters" }),
  }),
  UPDATE: z.object({
    role_name: z
      .string()
      .min(3, { message: "role name length must be over 3 characters" })
      .max(100, { message: "role name max 100 characters" }),
    manage_admin: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_admin must be true or false",
      })
      .optional(),
    manage_user: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_user must be true or false",
      })
      .optional(),
    manage_users: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_user must be true or false",
      })
      .optional(),
    manage_file_user: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_file_user must be true or false",
      })
      .optional(),
    manage_file_users: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_file_users must be true or false",
      })
      .optional(),
    manage_roles: z
      .boolean()
      .refine((val) => val === true || val === false, {
        message: "manage_roles must be true or false",
      })
      .optional(),
  }),
};

export default RoleValidation;
