import { GetMyAllNotificationResType } from "@/schema/notification";
import http from "@/util/http";

const notification = {
  getMyAllNotification: (token: string) =>
    http.get<GetMyAllNotificationResType>("notification/user", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default notification;
