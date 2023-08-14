import * as z from "zod";

export const commentSchema = z.object({
  text: z.string().min(1).max(99),
});
