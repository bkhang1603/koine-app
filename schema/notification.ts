import z from "zod";

export const myNotification = z.object({
  data: z.string(),
});

export type GetMyAllNotificationResType = z.infer<typeof myNotification>;
