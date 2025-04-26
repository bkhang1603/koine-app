import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";
import { useSocket } from "@/util/SocketProvider";
import { router } from "expo-router";
import { useAppStore } from "@/components/app-provider";
import {
  useMarkNotificationAsRead,
  useMyNotification,
  useMyNotificationDetail,
} from "@/queries/useNotification";

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
  const { socket } = useSocket();
  // console.log(socket)

  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  //cái này là get all
  const {
    data: allNotification,
    isError,
    isLoading,
    error,
    refetch,
  } = useMyNotification(token);

  //get detail không tạo trang noti detail thì bỏ cái này được
  //   const {
  //     data: notificationDetail,
  //     isError,
  //     isLoading,
  //     error,
  //     refetch,
  //   } = useMyNotificationDetail(token, notificationId);

  //mark as read
  const markAsRead = useMarkNotificationAsRead();

  //này kết nối socket t không biết đúng k, có gì check cái until socketprovider
  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (data: any) => {
      console.log("📩 Nhận thông báo:", data);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  return (
    <View className="flex-1 bg-white">
      {/* // Tôi muốn returnTab sẽ trở về màn hình trước đó chứ không phải một màn hình cụ thể */}
      <HeaderWithBack
        title="Thông báo"
        returnTabFunction={() => router.back()}
      />

      <ScrollView>
        <View className="p-4">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <Pressable
              key={notification.id}
              className={`flex-row items-start p-4 mb-2 rounded-xl ${
                notification.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  notification.read ? "bg-gray-100" : "bg-blue-100"
                }`}
              >
                <MaterialIcons
                  name={getNotificationIcon(notification.type)}
                  size={20}
                  color={notification.read ? "#6B7280" : "#3B82F6"}
                />
              </View>
              <View className="flex-1 ml-3">
                <Text
                  className={`font-bold ${
                    notification.read ? "text-gray-900" : "text-blue-900"
                  }`}
                >
                  {notification.title}
                </Text>
                <Text
                  className={
                    notification.read ? "text-gray-600" : "text-blue-800"
                  }
                >
                  {notification.message}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {notification.time}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
