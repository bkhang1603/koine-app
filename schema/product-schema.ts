import z from 'zod'

const ImageSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url()
})

const CategorySchema = z.object({
  id: z.string(),
  name: z.string()
})

export const productRes = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      nameNoTone: z.string(),
      slug: z.string(),
      description: z.string(),
      price: z.number(),
      discount: z.nullable(z.number()), // Có thể là null
      stockQuantity: z.number(),
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
      categories: z.array(CategorySchema),
      images: z.array(ImageSchema)
    })
  )
})

export type GetAllProductResType = z.TypeOf<typeof productRes>
