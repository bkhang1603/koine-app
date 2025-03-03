import z from "zod";

export const childs = z.array(
  z.object({
    id: z.string(),
    role: z.string(),
    parentId: z.string(),
    userDetail: z.object({
      firstName: z.string(),
      lastName: z.string(),
      dob: z.string(),
      avatarUrl: z.string(),
      gender: z.string(),
    }),
    createdAtFormatted: z.string(),
  })
);

export type Childs = z.TypeOf<typeof childs>;
