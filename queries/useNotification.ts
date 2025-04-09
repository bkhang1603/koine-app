import notification from "@/api/notification";
import {
  GetMyAllNotificationResType,
  GetMyNotificationDetailResType,
} from "@/schema/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMyNotification = (token: string) => {
  return useQuery<GetMyAllNotificationResType>({
    queryKey: ["my-notification"],
    queryFn: () => notification.getMyAllNotification(token),
  });
};

export const useMyNotificationDetail = (
  token: string,
  notificationId: string
) => {
  return useQuery<GetMyNotificationDetailResType>({
    queryKey: ["my-notification-detail"],
    queryFn: () => notification.getMyNotificationDetail(token, notificationId),
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => notification.markNotificationAsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-notification"],
      });
    },
  });
};
