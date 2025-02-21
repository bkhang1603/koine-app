import z from 'zod'

export const courseRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      titleNoTone: z.string(),
      slug: z.string(),
      description: z.string(),
      durations: z.number(),
      imageUrl: z.string(),
      imageBanner: z.string(),
      price: z.number(),
      discount: z.number().optional(),
      totalEnrollment: z.number(),
      aveRating: z.number(),
      isBanned: z.boolean(),
      isCustom: z.boolean(),
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
      durationsDisplay: z.string(),
      level: z.string(),
      prerequisiteId: z.string().nullable(),
      creatorId: z.string(),
      creator: z.object({
        id: z.string(),
        username: z.string()
      }),
      categories: z.array(
        z.object({
          id: z.string(),
          name: z.string()
        })
      )
    })
  ),
  pagination: z.object({
    pageSize: z.number(),
    totalItem: z.number(),
    currentPage: z.number(),
    maxPageSize: z.number(),
    totalPage: z.number()
  })
})

export type GetAllCourseResType = z.infer<typeof courseRes>

export const courseDetailRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    isDeleted: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string(),
    creatorId: z.string(),
    title: z.string(),
    titleNoTone: z.string(),
    slug: z.string(),
    description: z.string(),
    durations: z.number().optional(),
    imageUrl: z.string(),
    imageBanner: z.string(),
    price: z.number(),
    discount: z.number().optional(),
    totalEnrollment: z.number(),
    aveRating: z.number(),
    isBanned: z.boolean(),
    isCustom: z.boolean(),
    prerequisiteId: z.string().nullable(),
    level: z.string(),
    durationsDisplay: z.string(),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string()
      })
    ),
    chapters: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        durations: z.number(),
        durationsDisplay: z.string(),
        sequence: z.number(),
        lessons: z.array(
          z.object({
            id: z.string(),
            type: z.enum(['DOCUMENT', 'VIDEO', 'BOTH']),
            title: z.string(),
            description: z.string(),
            durations: z.number(),
            content: z.string().nullable(),
            videoUrl: z.string().nullable(),
            sequence: z.number(),
            durationsDisplay: z.string()
          })
        )
      })
    ).optional()
  })
})

export type GetCourseDetailResType = z.infer<typeof courseDetailRes>

