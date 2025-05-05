import notification from "@/api/notification";
import { useAppStore } from "@/components/app-provider";
import {
  GetMyAllNotificationResType
} from "@/schema/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useMyNotification = ({
  token,
  page_index,
  page_size,
}: {
  token: string;
  page_index: number;
  page_size: number;
}) => {
  const setNotificationBadge = useAppStore(
    (state) => state.setNotificationBadge
  );

  const query = useQuery<GetMyAllNotificationResType, Error>({
    queryKey: ["my-notification", page_index, page_size],
    queryFn: () =>
      notification.getMyAllNotification(token, page_index, page_size),
  });

  useEffect(() => {
    if (query.data) {
      const unreadCount =
        query.data.data?.filter((item) => !item.isRead).length || 0;
      setNotificationBadge(unreadCount); // Nếu không cần +1 thì bỏ đi
    }
  }, [query.data, setNotificationBadge]);

  return query;
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => notification.markNotificationAsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-notification", 1, 100], // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};
