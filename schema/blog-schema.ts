import z from 'zod';

export const blogRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.array(
    z.object({
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      id: z.string(),
      creatorId: z.string(),
      title: z.string(),
      titleNoTone: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      content: z.string(),
      imageUrl: z.string(),
      status: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
      creatorInfo: z.object({
        id: z.string(),
        firstName: z.string(),
        avatarUrl: z.string(),
      }),
      totalReact: z.number(),
      totalComment: z.number(),
      categories: z.array(z.any()),
    })
  ),
  pagination: z.object({
    pageSize: z.number(),
    totalItem: z.number(),
    currentPage: z.number(),
    maxPageSize: z.number(),
    totalPage: z.number(),
  }),
});

export type GetAllBlogResType = z.infer<typeof blogRes>;

export const blogDetailRes = z.object({
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
    description: z.string().nullable(),
    content: z.string(),
    imageUrl: z.string(),
    status: z.string(),
    createdAtFormatted: z.string(),
    updatedAtFormatted: z.string(),
    creatorInfo: z.object({
      id: z.string(),
      firstName: z.string(),
      avatarUrl: z.string(),
    }),
    isReact: z.boolean(),
    totalReact: z.number(),
    totalComment: z.number(),
    categories: z.array(z.any()),
  }),
});

export type GetBlogDetailResType = z.infer<typeof blogDetailRes>;