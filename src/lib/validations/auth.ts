import * as z from "zod";

export const authSchema = z.object({
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
