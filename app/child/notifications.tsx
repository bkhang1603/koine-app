import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "@/util/SocketProvider";
import { useAppStore } from "@/components/app-provider";
import {
  useMarkNotificationAsRead,
  useMyNotification,
} from "@/queries/useNotification";
import {
  GetMyAllNotificationResType,
  myNotification,
} from "@/schema/notification";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "Chúc mừng bạn! 🎉",
    message: "Bạn đã hoàn thành khóa học Kỹ năng giao tiếp",
    type: "achievement",
    time: "2 giờ trước",
    read: false,
    points: 100,
  },
  {
    id: "2",
    title: "Nhiệm vụ hàng ngày 🎯",
    message: "Bạn đã hoàn thành 3/5 nhiệm vụ hôm nay. Cố lên nào!",
    type: "daily",
    time: "5 giờ trước",
    read: true,
  },
  {
    id: "3",
    title: "Khóa học mới! 📚",
    message: "Khám phá khóa học mới về Quản lý cảm xúc ngay nào",
    type: "course",
    time: "1 ngày trước",
    read: true,
  },
  {
    id: "4",
    title: "Streak 5 ngày! 🔥",
    message: "Bạn đã học liên tục 5 ngày. Tuyệt vời lắm!",
    type: "streak",
    time: "2 ngày trước",
    read: true,
    streakDays: 5,
  },
];

export default function NotificationsScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const badge = useAppStore((state) => state.notificationBadge);
  const [isProcessing, setProcessing] = useState(false);

  const {
    data: allNotification,
    isError,
    isLoading,
    error,
    refetch,
  } = useMyNotification({ token, page_index: 1, page_size: 100 });
  const convertTimeSend = (str: string): string => {
    const [time, date] = str.split("-");

    return `${time} ${date}`;
  };

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
    } catch (error) {
      console.log("Error ", error);
    } finally {
      setProcessing(false);
    }
  };

  if (myNoti.length == 0) {
    return (
      <View className="flex-1 bg-white">
        {/* // Tôi muốn returnTab sẽ trở về màn hình trước đó chứ không phải một màn hình cụ thể */}
        <HeaderWithBack
          title="Thông báo"
          returnTabFunction={() => router.back()}
          showMoreOptions={false}
        />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="notifications" size={64} color="gray" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Bạn chưa có thông báo
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/child/(tabs)/home")}
          >
            <Text className="text-white font-bold">Quay về trang chủ?</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Thông báo"
        returnTab="/child/(tabs)/home"
        showMoreOptions={false}
      />
      <Pressable
        onPress={() => {
          markNotiRead();
        }}
        disabled={badge == 0 ? true : false}
        className="self-end mt-1 mr-3 bg-slate-300 rounded-lg"
      >
        <Text className="p-1 font-semibold">Đánh dấu đã đọc</Text>
      </Pressable>
      <ScrollView>
        <View className="p-4">
          {myNoti.map((notification) => (
            <Pressable
              key={notification.id}
              className={`mb-4 rounded-2xl overflow-hidden border border-gray-200 ${
                notification.isRead ? "opacity-70" : ""
              }`}
            >
              {/* Header với màu nền tương ứng */}
              <View
                className={`p-3 ${
                  notification.type === "achievement"
                    ? "bg-yellow-500"
                    : notification.type === "daily"
                    ? "bg-green-500"
                    : notification.type === "streak"
                    ? "bg-orange-500"
                    : "bg-violet-500"
                }`}
              >
                <Text className="text-white font-bold">
                  {notification.title}
                </Text>
                <Text className="text-white/80 text-sm">
                  {convertTimeSend(notification.timeSend)}
                </Text>
              </View>

              {/* Content */}
              <View className="p-4 bg-white">
                <View className="flex-row items-start">
                  <View
                    className={`w-12 h-12 rounded-xl items-center justify-center ${
                      notification.type === "achievement"
                        ? "bg-yellow-100"
                        : notification.type === "daily"
                        ? "bg-green-100"
                        : notification.type === "streak"
                        ? "bg-orange-100"
                        : "bg-violet-100"
                    }`}
                  >
                    <MaterialIcons
                      name={
                        notification.type === "achievement"
                          ? "emoji-events"
                          : notification.type === "daily"
                          ? "today"
                          : notification.type === "streak"
                          ? "local-fire-department"
                          : "school"
                      }
                      size={28}
                      color={
                        notification.type === "achievement"
                          ? "#F59E0B"
                          : notification.type === "daily"
                          ? "#10B981"
                          : notification.type === "streak"
                          ? "#F97316"
                          : "#7C3AED"
                      }
                    />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-600 text-base leading-5">
                      {notification.description}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
