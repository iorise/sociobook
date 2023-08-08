import * as z from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().max(99).optional(),
  externalImage: z.string().optional(),
  coverImage: z.string().optional(),
});
