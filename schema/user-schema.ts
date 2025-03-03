import { GenderValues, RoleValues } from "@/constants/type";
import z from "zod";

export const userRes = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
      username: z.string(),
      role: z.enum([
        "ADMIN",
        "CONTENT_CREATOR",
        "ADULT",
        "ACCOUNTING",
        "MANAGER",
        "LECTURER",
        "SUPPORTER",
      ]),
      accountType: z.string(),
      isActive: z.boolean(),
      userDetail: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().nullable().optional(),
        dob: z.string(),
        address: z.string().nullable().optional(),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]),
        avatarUrl: z.string().nullable().optional(),
      }),
      createAtFormatted: z.string(),
      updateAtFormatted: z.string(),
    })
  ),
  message: z.string(),
});

export type GetUserResType = z.TypeOf<typeof userRes>;

export const myCourseRes = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      durationDisplay: z.string(),
      categories: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
      completionRate: z.number(),
      author: z.string(),
      imageUrl: z.string(),
      level: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
    })
  ),
  message: z.string(),
});

export type GetMyCoursesResType = z.TypeOf<typeof myCourseRes>;

export const myCourseDetailRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    //course
    id: z.string(),
    title: z.string(),
    description: z.string(),
    durationDisplay: z.string(),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    completionRate: z.number(),
    author: z.string(),
    imageUrl: z.string(),
    createdAtFormatted: z.string(),
    updatedAtFormatted: z.string(),

    //chapter
    chapters: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        sequence: z.number(),
        status: z.string(),
      })
    ),
  }),
});

export type GetMyCourseDetailResType = z.TypeOf<typeof myCourseDetailRes>;

export const myChapterDetailRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    durationDisplay: z.string(),
    status: z.string(),
    sequence: z.number(),
    lessons: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        status: z.string(),
        sequence: z.number(),
        durationDisplay: z.string(),
      })
    ),
  }),
});

export type GetMyChapterDetailResType = z.TypeOf<typeof myChapterDetailRes>;

export const myLessonDetailRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    durationDisplay: z.string(),
    sequence: z.number(),
    chapterId: z.string(),
    type: z.enum(["DOCUMENT", "VIDEO", "BOTH"]),
    content: z.string().nullable(),
    videoUrl: z.string().nullable(),
    status: z.string(),
  }),
});

export type GetMyLessonDetailResType = z.TypeOf<typeof myLessonDetailRes>;

export const createProgressBody = z
  .object({
    lessonId: z.string(),
  })
  .strict();

export type CreateProgressBodyType = z.TypeOf<typeof createProgressBody>;

export const userProfileRes = z.object({
  data: z.object({
    id: z.string(),
    email: z.string().nullable(),
    username: z.string(),
    role: z.enum([
      "ADMIN",
      "CONTENT_CREATOR",
      "ADULT",
      "ACCOUNTING",
      "MANAGER",
      "LECTURER",
      "SUPPORTER",
    ]),
    parentId: z.string().optional(),
    phone: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    dob: z.string(),
    address: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    avatarUrl: z.string(),
  }),
  message: z.string(),
});

export type GetUserProfileResType = z.TypeOf<typeof userProfileRes>;

export const getMyChild = z.object({
  message: z.string(),
  data: z.array(
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
  ),
});

export type GetMyChildsResType = z.TypeOf<typeof getMyChild>;

export const editProfileBodyType = z.object({
  parentId: z.string().optional(),
  phone: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string().optional(),
  address: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  avatarUrl: z.string(),
});
export type EditProfileBodyType = z.TypeOf<typeof editProfileBodyType>;

export const editProfileResType = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export type EditProfileResType = z.TypeOf<typeof editProfileResType>;

export const myChildCourseProgressResType = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    courseId: z.string(),
    courseTitle: z.string(),
    courseImageUrl: z.string(),
    isAccessibleByChild: z.boolean(),
    courseCompletionRate: z.number(),
    totalLesson: z.number(),
    totalLessonFinished: z.number(),
    totalLearningTime: z.number(),
    enrollmentDate: z.string(),
    completionDate: z.string(),
    chapters: z.array(
      z.object({
        chapterId: z.string(),
        chapterTitle: z.string(),
        chapterDescription: z.string(),
        chapterSequence: z.number(),
        chapterStatus: z.string(),
        chapterCompletionRate: z.number(),
        lessons: z.array(
          z.object({
            lessonId: z.string(),
            lessonTitle: z.string(),
            lessonType: z.string(),
            lessonDurationDisplay: z.string(),
            lessonSequence: z.number(),
            lessonStatus: z.string(),
          })
        ),
      })
    ),
  }),
});

export type GetMyChildCourseProgressResType = z.TypeOf<
  typeof myChildCourseProgressResType
>;

export const editChildProfileByParentBodyType = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string(),
  gender: z.string(),
  avatarUrl: z.string(),
});
export type UpdateChildProfileByParent = z.TypeOf<
  typeof editChildProfileByParentBodyType
>;
