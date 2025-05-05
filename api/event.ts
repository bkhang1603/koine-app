import { EventDetailResType, GetAllEventResType } from "@/schema/event-schema";
import http from "@/util/http";

const eventRequestApi = {
  getAllEvent: (page_index: number, page_size: number) =>
    http.get<GetAllEventResType>(
      `events?page_size=${page_size}&page_index=${page_index}`
    ),

  getEventDetail: (token: string, eventId: string) =>
    http.get<EventDetailResType>(`events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default eventRequestApi;
