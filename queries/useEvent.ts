import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/components/app-provider";
import { useEffect } from "react";
import { RoleValues } from "@/constants/type";
import {
  CancelEventRequestType,
  CreateEventMeetingRequestType,
  CreateEventRoomRequestType,
  GetAllEventResType,
  UpdateEventRequestType,
} from "@/schema/event-schema";
import eventRequestApi from "@/api/event";

export const useEvent = () => {
  return useQuery<GetAllEventResType>({
    queryKey: ["events"],
    queryFn: () => eventRequestApi.getAllEvent(),
  });
};

export const useEventForHost = (token: string) => {
  return useQuery<GetAllEventResType>({
    queryKey: ["events-host"],
    queryFn: () => eventRequestApi.getAllEventForHost(token),
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: CreateEventMeetingRequestType;
      token: string;
    }) => eventRequestApi.createEvent(token, body),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
      queryClient.invalidateQueries({
        queryKey: ["events-host"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};

export const useUpdateEventWhenCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
      eventId,
    }: {
      body: CreateEventRoomRequestType;
      token: string;
      eventId: string;
    }) => eventRequestApi.updateEventWhenCreateRoom(token, body, eventId),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
      queryClient.invalidateQueries({
        queryKey: ["events-host"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
      eventId,
    }: {
      body: UpdateEventRequestType;
      token: string;
      eventId: string;
    }) => eventRequestApi.updateEvent(token, body, eventId),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
      queryClient.invalidateQueries({
        queryKey: ["events-host"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};

export const useCancelEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: CancelEventRequestType;
      token: string;
    }) => eventRequestApi.cancelEvent(token, body),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
      queryClient.invalidateQueries({
        queryKey: ["events-host"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};
