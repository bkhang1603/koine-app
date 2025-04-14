import {
  GetMyAllNotificationResType,
  GetMyNotificationDetailResType,
  MarkNotificationAsReadResType,
} from "@/schema/notification";
import http from "@/util/http";

const notification = {
  getMyAllNotification: (token: string) =>
    http.get<GetMyAllNotificationResType>("notification", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getMyNotificationDetail: (token: string, notificationId: string) =>
    http.get<GetMyNotificationDetailResType>(`notification/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  markNotificationAsRead: (token: string) =>
    http.put<MarkNotificationAsReadResType>("notification/read", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default notification;
