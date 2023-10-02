import * as z from "zod";

export const postSchema = z.object({
  text: z.string().max(300).optional(),
  images: z
  .unknown()
  .refine((val) => {
    if (!Array.isArray(val)) return false
    if (val.some((file) => !(file instanceof File))) return false
    return true
  }, "Must be an array of File")
  .optional()
  .nullable()
  .default(null),
});
