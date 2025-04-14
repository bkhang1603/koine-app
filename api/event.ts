import {
  CancelEventRequestType,
  CreateEventMeetingRequestType,
  CreateEventRoomRequestType,
  EventDetailResType,
  GetAllEventResType,
  UpdateEventRequestType,
} from "@/schema/event-schema";
import http from "@/util/http";

const eventRequestApi = {
  createEvent: (token: string, body: CreateEventMeetingRequestType) =>
    http.post<any>("events", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getAllEvent: () => http.get<GetAllEventResType>("events"),
  getAllEventForHost: (token: string) =>
    http.get<GetAllEventResType>("events/host", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateEvent: (token: string, body: UpdateEventRequestType, eventId: string) =>
    http.put<any>(`events/${eventId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  cancelEvent: (token: string, body: CancelEventRequestType) =>
    http.put<any>("events/cancel", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getEventDetail: (token: string, eventId: string) =>
    http.get<EventDetailResType>(`events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default eventRequestApi;
