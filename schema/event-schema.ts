import z from "zod";

//create
export const createEventMeetingRequest = z.object({
  title: z.string(),
  description: z.string(),
  startedAt: z.string(),
  imageUrl: z.string(),
  durations: z.number(),
});
export type CreateEventMeetingRequestType = z.infer<
  typeof createEventMeetingRequest
>;

export const getAllEventResType = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      startedAt: z.string(),
      startAtFormatted: z.string(),
      durations: z.number(),
      durationsDisplay: z.string(),
      imageUrl: z.string(),
      roomHostUrl: z.string(),
      roomName: z.string(),
      roomUrl: z.string(),
      recordUrl: z.string(),
      status: z.string(),
      totalParticipants: z.number(),
      createdAt: z.string(),
      updateAt: z.string(),
      hostInfo: z.object({
        id: z.string(),
        fullName: z.string(),
        email: z.string(),
        avatarUrl: z.string(),
      }),
    })
  )
})

export type GetAllEventResType = z.infer<typeof getAllEventResType>;


//cancel
export const cancelEventRequest = z.object({
  eventId: z.string(),
  note: z.string(),
});
export type CancelEventRequestType = z.infer<typeof cancelEventRequest>;


//update thông tin lúc tạo phòng
export const createEventRoomRequest = z.object({
  roomUrl: z.string(),
  roomHostUrl: z.string(),
  roomName: z.string(),
});
export type CreateEventRoomRequestType = z.infer<typeof createEventRoomRequest>;



//update thông tin khác
export const updateEventRequest = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startedAt: z
    .union([
      z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message:
          "Thời gian bắt đầu không hợp lệ, sử dụng định dạng ISO: YYYY-MM-DDTHH:MM:SS",
      }),
      z.date(),
    ])
    .optional(),
  durations: z.number().int().optional(),
  imageUrl: z.string().optional(),
  roomUrl: z.string().optional(),
  status: z.string().optional(),
  roomHostUrl: z.string().optional(),
  roomName: z.string().optional(),
  recordUrl: z.string().optional(),
  totalParticipants: z.number().int().optional(),
  note: z.string().optional(),
});

export type UpdateEventRequestType = z.infer<typeof updateEventRequest>;


