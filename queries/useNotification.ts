import notification from "@/api/notification";
import { GetMyAllNotificationResType } from "@/schema/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMyNotification = (token: string) => {
  return useQuery<GetMyAllNotificationResType>({
    queryKey: ["my-notification"],
    queryFn: () => notification.getMyAllNotification(token),
  });
};
