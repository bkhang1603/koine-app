import z from 'zod'

const ImageSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
})

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const productRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      nameNoTone: z.string(),
      slug: z.string(),
      description: z.string(),
      detail: z.string(),
      guide: z.string(),
      price: z.number(),
      totalRating: z.number(),
      averageRating: z.number(),
      discount: z.number().nullable(),
      stockQuantity: z.number(),
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
      creatorId: z.string(),
      categories: z.array(CategorySchema),
      images: z.array(ImageSchema),
    })
  ),
  pagination: z.object({
    pageSize: z.number(),
    totalItem: z.number(),
    currentPage: z.number(),
    maxPageSize: z.number(),
    totalPage: z.number(),
  }),
})

export type GetAllProductResType = z.infer<typeof productRes>

export const getProductReviews = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    ratingInfos: z.array(
      z.object({
        isDeleted: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
        productId: z.string(),
        userId: z.string(),
        orderDetailId: z.string(),
        rating: z.number(),
        review: z.string(),
        user: z.object({
          id: z.string(),
          username: z.string(),
        }),
        createdAtFormatted: z.string(),
        updatedAtFormatted: z.string(),
      })
    ),
    stars: z.object({
      totalRating: z.number(),
      ratings: z.object({
        1: z.number(),
        2: z.number(),
        3: z.number(),
        4: z.number(),
        5: z.number(),
      }),
      averageRating: z.number(),
    }),
  }),
  pagination: z.object({
    pageSize: z.number(),
    totalItem: z.number(),
    currentPage: z.number(),
    maxPageSize: z.number(),
    totalPage: z.number(),
  }),
})

export type GetProductReviews = z.infer<typeof getProductReviews>
