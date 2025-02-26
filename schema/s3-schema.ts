import z from "zod";

export const uploadImageBodyType = z.instanceof(FormData);

export type UploadImageBodyType = z.infer<typeof uploadImageBodyType>;

export const uploadImageResType = z.object({
  data: z.array(z.string()),
});

export type UploadImageResType = z.infer<typeof uploadImageResType>;
