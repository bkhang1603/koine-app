import { useQuery } from "@tanstack/react-query";

import { EventDetailResType, GetAllEventResType } from "@/schema/event-schema";
import eventRequestApi from "@/api/event";

export const useEvent = ({page_index, page_size}:{page_index: number; page_size: number}) => {
  return useQuery<GetAllEventResType>({
    queryKey: ["events"],
    queryFn: () => eventRequestApi.getAllEvent(page_index, page_size),
  });
};

export const useEventDetail = (token: string, eventId: string) => {
  return useQuery<EventDetailResType>({
    queryKey: ["events-detail", eventId],
    queryFn: () => eventRequestApi.getEventDetail(token, eventId),
  });
};
