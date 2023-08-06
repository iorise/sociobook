import * as z from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1).nonempty({
    message: "Name must be atleast 1 string.",
  }),
  lastName: z.string().min(1).optional(),
  profileImage: z.string().optional(),
});
