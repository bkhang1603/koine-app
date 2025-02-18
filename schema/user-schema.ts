import { GenderValues, RoleValues } from '@/constants/type'
import z from 'zod'

export const userRes = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
      username: z.string(),
      role: z.enum(['ADMIN', 'CONTENT_CREATOR', 'ADULT', 'ACCOUNTING', 'MANAGER', 'LECTURER', 'SUPPORTER']),
      accountType: z.string(),
      isActive: z.boolean(),
      userDetail: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().nullable().optional(),
        dob: z.string(),
        address: z.string().nullable().optional(),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
        avatarUrl: z.string().nullable().optional()
      }),
      createAtFormatted: z.string(),
      updateAtFormatted: z.string()
    })
  ),
  message: z.string()
})

export type GetUserResType = z.TypeOf<typeof userRes>

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
          name: z.string()
        })
      ),
      completionRate: z.number(),
      author: z.string(),
      imageUrl: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string()
    })
  ),
  message: z.string()
})

export type GetMyCoursesResType = z.TypeOf<typeof myCourseRes>

export const myCourseDetailRes = z.object({
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
        status: z.string()
      })
    ),
    completionRate: z.string(),
    author: z.string(),
    imageUrl: z.string(),
    createAtFormatted: z.string(),
    updateAtFormatted: z.string(),

    //chapter
    chapters: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        sequence: z.string(),
        status: z.string()
      })
    )
  }),
  message: z.string()
})

export type GetMyCourseDetailResType = z.TypeOf<typeof myCourseDetailRes>

export const myChapterDetailRes = z.object({
  data: z.object({
    //chapter
    id: z.string(),
    title: z.string(),
    description: z.string(),
    durationDisplay: z.string(),
    status: z.string(),
    sequence: z.string(),
    //lesson
    lessons: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        status: z.string(),
        sequence: z.string()
      })
    )
  }),

  message: z.string()
})

export type GetMyChapterDetailResType = z.TypeOf<typeof myChapterDetailRes>

export const myLessonDetailRes = z.object({
  data: z.object({
    //lesson
    id: z.string(),
    title: z.string(),
    description: z.string(),
    durationDisplay: z.string(),
    sequence: z.string(),
    chapterId: z.string(),
    type: z.string(),
    content: z.string(),
    videoUrl: z.string(),
    status: z.string()
  }),
  message: z.string()
})

export type GetMyLessonDetailResType = z.TypeOf<typeof myLessonDetailRes>

export const createProgressBody = z
  .object({
    lessonId: z.string()
  })
  .strict()

export type CreateProgressBodyType = z.TypeOf<typeof createProgressBody>

export const userProfileRes = z.object({
  data: z.object({
    id: z.string(),
    email: z.string().nullable(),
    username: z.string(),
    role: z.enum(['ADMIN', 'CONTENT_CREATOR', 'ADULT', 'ACCOUNTING', 'MANAGER', 'LECTURER', 'SUPPORTER']),
    parentId: z.string().optional(),
    phone: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    dob: z.string(),
    address: z.string(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    avatarUrl: z.string().nullable()
  }),
  message: z.string()
})

export type GetUserProfileResType = z.TypeOf<typeof userProfileRes>
