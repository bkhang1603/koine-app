import z from 'zod'

const CategorySchema = z.object({
  id: z.string(),
  name: z.string()
})

export const courseRes = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      titleNoTone: z.string(),
      slug: z.string(),
      description: z.string(),
      durations: z.string(),
      imageUrl: z.string(),
      imageBanner: z.string(),
      price: z.number(),
      discount: z.nullable(z.number()), // Có thể là null
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
      categories: z.array(CategorySchema)
    })
  )
})

export type GetAllCourseResType = z.TypeOf<typeof courseRes>
