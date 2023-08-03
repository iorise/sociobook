import * as z from "zod";

export const postSchema = z.object({
  text: z.string().min(1).nonempty({
    message: "Post cannot be empty.",
  }),
  image: z.string().optional(),
});
