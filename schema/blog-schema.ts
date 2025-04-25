import z from "zod";

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
    isReact: z.boolean(),
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
    isBanned: z.boolean().nullable(),
    createdAtFormatted: z.string(),
    updatedAtFormatted: z.string(),
    creatorInfo: z.object({
      id: z.string(),
      firstName: z.string(),
      avatarUrl: z.string(),
    }),
    totalReact: z.number(),
    totalComment: z.number(),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    hashtags: z.array(z.string()).nullable(),
  }),
});

export type GetBlogDetailResType = z.infer<typeof blogDetailRes>;

export const blogCommentRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    totalComments: z.number(),
    commentsWithReplies: z
      .array(
        z.object({
          isDeleted: z.boolean(),
          createdAt: z.string(),
          updatedAt: z.string(),
          id: z.string(),
          userId: z.string(),
          blogId: z.string(),
          replyId: z.string().nullable(),
          content: z.string(),
          createdAtFormatted: z.string(),
          updatedAtFormatted: z.string(),
          user: z.object({
            id: z.string(),
            firstName: z.string(),
            avatarUrl: z.string(),
            username: z.string(),
          }),
          replies: z.array(z.any()).optional(),
        })
      )
      .optional(),
  }),
  pagination: z
    .object({
      pageSize: z.number(),
      totalItem: z.number(),
      currentPage: z.number(),
      maxPageSize: z.number(),
      totalPage: z.number(),
    })
    .optional(),
});

export type GetAllBlogCommentsResType = z.infer<typeof blogCommentRes>;

export const createBlogCommentBody = z.object({
  identifier: z.string(),
  content: z.string(),
});

export type CreateBlogCommentBodyType = z.infer<typeof createBlogCommentBody>;

export const createBlogCommentRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    userId: z.string(),
    blogId: z.string(),
    replyId: z.string().nullable(),
    content: z.string(),
    isDeleted: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string(),
  }),
});

export type CreateBlogCommentResType = z.infer<typeof createBlogCommentRes>;

export const createBlogReactBody = z.object({
  identifier: z.string(),
  isReact: z.boolean(),
});

export type CreateBlogReactBodyType = z.infer<typeof createBlogReactBody>;

export const createBlogReactRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
});

export type CreateBlogReactResType = z.infer<typeof createBlogReactRes>;
