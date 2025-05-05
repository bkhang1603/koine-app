import {
  GetMyAllNotificationResType,
  MarkNotificationAsReadResType,
} from "@/schema/notification";
import http from "@/util/http";
//`blogs?keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`
const notification = {
  getMyAllNotification: (
    token: string,
    page_index: number,
    page_size: number
  ) =>
    http.get<GetMyAllNotificationResType>(
      `notification?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
  markNotificationAsRead: (token: string) =>
    http.put<MarkNotificationAsReadResType>(
      "notification/read",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
};

export default notification;
