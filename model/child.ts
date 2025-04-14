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

export const childProfile = z.object({
  id: z.string(),
  avatarUrl: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string(),
  gender: z.string(),
  level: z.string(),
  totalCourses: z.number(),
  totalLearningDays: z.number(),
  totalPoints: z.number(),
});

export type ChildProfileType = z.TypeOf<typeof childProfile>;
