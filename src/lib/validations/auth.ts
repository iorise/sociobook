import * as z from "zod";

export const loginUserSchema = z.object({
  email: z.string().email({
    message:
      "The email address or mobile number you entered isn't connected to an account.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/\d/, {
      message: "Password must contain at least one number",
    }),
});

export const registerUserSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters long"
  }),
  firstName: z.string(),
  lastName: z.string(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is invalid",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/\d/, {
      message: "Password must contain at least one number",
    }),
});

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
});
