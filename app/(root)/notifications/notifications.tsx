import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";
import { router, useFocusEffect } from "expo-router";
import { useAppStore } from "@/components/app-provider";
import {
  useMarkNotificationAsRead,
  useMyNotification
} from "@/queries/useNotification";
import {
  GetMyAllNotificationResType,
  myNotification,
} from "@/schema/notification";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "INFO":
      return "menu-book";
    case "WARNING":
      return "warning";
    case "ERROR":
      return "error";
    default:
      return "notifications";
  }
};

export default function NotificationsScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const badge = useAppStore((state) => state.notificationBadge);
  //cái này là get all
  const {
    data: allNotification,
    isError,
    isLoading,
    error,
    refetch,
  } = useMyNotification({ token, page_index: 1, page_size: 100 });
  const [isProcessing, setProcessing] = useState(false);

  if (isLoading) console.log("Loading notification");
  if (isError) console.log(error);

  let myNoti: GetMyAllNotificationResType["data"] = [];

  if (allNotification && !isError) {
    if (allNotification.data.length > 0) {
      // Bổ sung giá trị mặc định nếu thiếu
      const parsedResult = myNotification.safeParse(allNotification);
      if (parsedResult.success) {
        myNoti = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  //mark as read
  const markAsRead = useMarkNotificationAsRead();

  const markNotiRead = async () => {
    try {
      if (isProcessing) return;
      setProcessing(true);
      await markAsRead.mutateAsync(token);
      console.log("xong")
    } catch (error) {
      console.log("Error ", error);
    } finally {
      setProcessing(false);
    }
  };

  const convertTimeSend = (str: string): string => {
    const [time, date] = str.split("-");

    return `${time} ${date}`;
  };

  return (
    <View className="flex-1 bg-white">
      {/* // Tôi muốn returnTab sẽ trở về màn hình trước đó chứ không phải một màn hình cụ thể */}
      <HeaderWithBack
        title="Thông báo"
        returnTabFunction={() => router.back()}
        showMoreOptions={false}
      />
      <Pressable
        onPress={() => {
          markNotiRead();
        }}
        disabled={badge == 0 ? true : false}
        className="self-end mt-1 mr-3 p-1 bg-slate-300 rounded-lg"
      >
        <Text className="p-1 font-semibold">Đánh dấu đã đọc</Text>
      </Pressable>
      <ScrollView>
        <View className="p-4">
          {myNoti.map((notification) => (
            <Pressable
              key={notification.id}
              className={`flex-row items-start p-4 mb-2 rounded-xl ${
                notification.isRead ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  notification.isRead ? "bg-gray-200" : "bg-blue-100"
                }`}
              >
                <MaterialIcons
                  name={getNotificationIcon(notification.type)}
                  size={20}
                  color={notification.isRead ? "#6B7280" : "#3B82F6"}
                />
              </View>
              <View className="flex-1 ml-3">
                <Text
                  className={`font-bold ${
                    notification.isRead ? "text-gray-900" : "text-blue-900"
                  }`}
                >
                  {notification.title}
                </Text>
                <Text
                  className={
                    notification.isRead ? "text-gray-600" : "text-blue-800"
                  }
                >
                  {notification.description}
                </Text>
                <Text
                  className={`${
                    notification.isRead ? "text-gray-600" : "text-blue-800"
                  } mt-2 `}
                >
                  {convertTimeSend(notification.timeSend)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
