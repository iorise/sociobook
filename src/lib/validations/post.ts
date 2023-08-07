import * as z from "zod";

export const postSchema = z.object({
  text: z.string().min(1).optional(),
  image: z.string().optional(),
});
