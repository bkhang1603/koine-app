import z from "zod";

export const myNotification = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      title: z.string(),
      description: z.string(),
      type: z.string(),
      isRead: z.boolean(),
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      timeSend: z.string(),
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

export type GetMyAllNotificationResType = z.infer<typeof myNotification>;

export const myNotificationDetail = z.object({
  data: z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.string(),
    isRead: z.boolean(),
    isDeleted: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    timeSend: z.string(),
  }),
});

export type GetMyNotificationDetailResType = z.infer<
  typeof myNotificationDetail
>;

export const markNotificationAsReadResType = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
});

export type MarkNotificationAsReadResType = z.infer<
  typeof markNotificationAsReadResType
>;
