import * as z from "zod";

export const profileSchema = z.object({
  bio: z.string().max(99).optional(),
  externalImage: z.string().optional(),
  coverImage: z.string().optional(),
});
