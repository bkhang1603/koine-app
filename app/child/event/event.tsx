import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEvent } from "@/queries/useEvent";
import formatDurationForString from "@/util/formatDurationForString";
import { useAppStore } from "@/components/app-provider";

export default function EventScreen() {
  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch,
  } = useEvent({ page_index: 1, page_size: 100 });
  const insets = useSafeAreaInsets();

  if (isLoading) console.log("loading");
  if (isError) console.log("error ", error);

  useFocusEffect(() => {
    refetch();
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const notificationBadge = useAppStore((state) => state.notificationBadge);

  const statusStyles = useMemo(
    () => ({
      OPENING: {
        textBackgroundColor: "bg-green-500",
        text: "Đang diễn ra",
        textColor: "text-white",
        backgroundColor: "bg-green-500",
      },
      PENDING: {
        textBackgroundColor: "bg-yellow-500",
        text: "Chưa mở",
        textColor: "text-black",
        backgroundColor: "bg-yellow-500",
      },
      DONE: {
        textBackgroundColor: "bg-gray-400",
        text: "Đã kết thúc",
        textColor: "text-white",
        backgroundColor: "bg-gray-400",
      },
      CANCELLED: {
        textBackgroundColor: "bg-gray-400",
        text: "Đã hủy",
        textColor: "text-white",
        backgroundColor: "bg-gray-400",
      },
    }),
    []
  );

  const openMeet = async (roomUrl: string | null) => {
    try {
      if (!roomUrl) roomUrl = "";
      await WebBrowser.openBrowserAsync(roomUrl);
      refetch();
    } catch (error) {
      console.log("Lỗi khi mở meet ", error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const isOpenable = (eventStartAt: Date, duration: number): boolean => {
    const now = new Date();
    // Chuyển giờ về GMT+7 (đảm bảo giờ giữ nguyên)
    const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const startTime = new Date(eventStartAt);
    const endDate = new Date(startTime.getTime() + duration * 1000); // duration tính theo giây
    return (
      localTime.getTime() >= startTime.getTime() &&
      localTime.getTime() < endDate.getTime()
    ); // chỉ mở khi trong khoảng startTime -> endDate
  };

  const isClosed = (eventStartAt: Date, duration: number): boolean => {
    const now = new Date();
    // Chuyển giờ về GMT+7 (đảm bảo giờ giữ nguyên)
    const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const startTime = new Date(eventStartAt);
    const endDate = new Date(startTime.getTime() + duration * 1000); // duration tính theo giây
    return localTime.getTime() >= endDate.getTime(); // chỉ mở khi trong khoảng startTime -> endDate
  };

  // const formatStartAtDisplay = (startAtDisplay: string): string => {
  //   // Tách phần thời gian và ngày
  //   const [timePart, datePart] = startAtDisplay.split("-"); // "19:04:00", "09/04/2025"
  //   const [hour, minute, second] = timePart.split(":").map(Number);
  //   const [day, month, year] = datePart.split("/").map(Number);

  //   // Tạo đối tượng Date (chú ý: tháng trong JS bắt đầu từ 0)
  //   const date = new Date(year, month - 1, day, hour, minute, second);

  //   // Trừ đi 7 giờ
  //   date.setHours(date.getHours() - 7);

  //   // Format lại thành chuỗi "HH:mm:ss-DD/MM/YYYY"
  //   const pad = (n: number): string => n.toString().padStart(2, "0");
  //   const formatted = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
  //     date.getSeconds()
  //   )}-${pad(date.getDate())}/${pad(
  //     date.getMonth() + 1
  //   )}/${date.getFullYear()}`;

  //   return formatted;
  // };

  const formatStartAt = (startAt: string): Date => {
    const startAtOTC = new Date(startAt);
    const startAtGMT7 = new Date(startAtOTC.getTime() + 7 * 3600 * 1000);
    return startAtGMT7;
  };

  const formatStartAtToDisplay = (startAt: string): string => {
    const startAtOTC = new Date(startAt);
    const startAtGMT7 = new Date(startAtOTC.getTime() + 7 * 60 * 60 * 1000);
    const hours = String(startAtGMT7.getUTCHours()).padStart(2, "0");
    const minutes = String(startAtGMT7.getUTCMinutes()).padStart(2, "0");
    const day = String(startAtGMT7.getUTCDate()).padStart(2, "0");
    const month = String(startAtGMT7.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = startAtGMT7.getUTCFullYear();
    return `${hours}:${minutes}-${day}/${month}/${year}`;
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top SafeArea */}
      <View className="bg-violet-500">
        <SafeAreaView edges={["top"]} className="bg-violet-500" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-8 bg-violet-500">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center mr-2"
                onPress={() => router.back()}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </Pressable>
              <View>
                <Text className="text-white text-xl font-bold">Sự kiện</Text>
                <Text className="text-white/80 mt-1">
                  Đón chờ những sự kiện thú vị
                </Text>
              </View>
            </View>
            <View className="flex-row">
              <Pressable
                className="w-10 h-10 mr-1 rounded-full bg-white/20 items-center justify-center"
                onPress={() => {
                  router.push("/child/notifications");
                }}
              >
                <MaterialIcons name="notifications" size={26} color="white" />
                {/* Rating Badge */}
                {notificationBadge && notificationBadge != 0 ? (
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {notificationBadge > 9 ? "9+" : notificationBadge}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </Pressable>
              <Pressable
                className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
                onPress={() => setShowOptions(!showOptions)}
              >
                <MaterialIcons name="more-vert" size={24} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Options Menu */}
          {showOptions && (
            <View className="absolute right-4 top-20 bg-white rounded-xl shadow-md z-10 w-48">
              <Pressable
                className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                onPress={() => {
                  router.push("/child/(tabs)/home" as any);
                  setShowOptions(false);
                }}
              >
                <MaterialIcons name="home" size={20} color="#8B5CF6" />
                <Text className="ml-2 text-gray-700">Trang chủ</Text>
              </Pressable>
              <Pressable
                className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                onPress={() => {
                  router.push("/child/(tabs)/my-courses" as any);
                  setShowOptions(false);
                }}
              >
                <MaterialIcons name="school" size={20} color="#8B5CF6" />
                <Text className="ml-2 text-gray-700">Khóa học của tôi</Text>
              </Pressable>
              <Pressable
                className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                onPress={() => {
                  router.push("/child/(tabs)/course" as any);
                  setShowOptions(false);
                }}
              >
                <MaterialIcons name="book" size={20} color="#8B5CF6" />
                <Text className="ml-2 text-gray-700">Khóa học</Text>
              </Pressable>
              <Pressable
                className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                onPress={() => {
                  router.push("/child/(tabs)/games" as any);
                  setShowOptions(false);
                }}
              >
                <MaterialIcons name="games" size={20} color="#8B5CF6" />
                <Text className="ml-2 text-gray-700">Trò chơi</Text>
              </Pressable>
              <Pressable
                className="px-4 py-3 flex-row items-center"
                onPress={() => {
                  router.push("/child/(tabs)/settings" as any);
                  setShowOptions(false);
                }}
              >
                <MaterialIcons name="settings" size={20} color="#8B5CF6" />
                <Text className="ml-2 text-gray-700">Cài đặt</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Main Content with rounded top corners */}
        <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-6">
          <View className="px-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold">Danh sách sự kiện</Text>
              <Text className="text-violet-500 font-medium">
                Tổng cộng: {events ? events.data.length : 0}
              </Text>
            </View>

            {events && events.data.length ? (
              <View className="space-y-4 pb-20">
                {events.data.map((event) => (
                  <Pressable
                    key={event.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                    onPress={() => {
                      router.push({
                        pathname: "/child/event/[id]",
                        params: { id: event.id },
                      });
                    }}
                    disabled={isProcessing}
                  >
                    <View className="relative">
                      <Image
                        source={{ uri: event.imageUrl }}
                        className="w-full h-48 rounded-t-2xl"
                      />
                      <View
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full ${
                          event.status.toUpperCase() == "OPENING" &&
                          isClosed(
                            formatStartAt(event.startedAt),
                            event.durations
                          )
                            ? "bg-gray-400"
                            : statusStyles[
                                event.status.toUpperCase() as keyof typeof statusStyles
                              ]?.backgroundColor
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            event.status.toUpperCase() == "OPENING" &&
                            isClosed(
                              formatStartAt(event.startedAt),
                              event.durations
                            )
                              ? "text-white"
                              : statusStyles[
                                  event.status.toUpperCase() as keyof typeof statusStyles
                                ]?.textColor
                          }`}
                        >
                          {event.status.toUpperCase() == "OPENING" &&
                          isClosed(
                            formatStartAt(event.startedAt),
                            event.durations
                          )
                            ? "Đã kết thúc"
                            : statusStyles[
                                event.status.toUpperCase() as keyof typeof statusStyles
                              ]?.text}
                        </Text>
                      </View>
                    </View>

                    <View className="p-4">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-bold text-lg text-gray-900">
                          {event.title}
                        </Text>
                      </View>

                      <Text className="text-gray-600 text-sm mt-2 mb-3">
                        {event.description}
                      </Text>

                      <View className="space-y-2 border-t border-gray-100 pt-3">
                        <View className="flex-row items-center">
                          <Feather name="mic" size={16} color="#6B7280" />
                          <Text className="text-gray-600 ml-2 text-sm">
                            {event.hostInfo.fullName}
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          <AntDesign
                            name="calendar"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-600 ml-2 text-sm">
                            {formatStartAtToDisplay(event.startedAt)}
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          <AntDesign
                            name="clockcircleo"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-600 ml-2 text-sm">
                            {formatDurationForString(event.durationsDisplay)}
                          </Text>
                        </View>
                      </View>

                      {isOpenable(
                        formatStartAt(event.startedAt),
                        event.durations
                      ) &&
                        event.status == "OPENING" && (
                          <Pressable
                            className="mt-4 bg-violet-500 py-2 rounded-xl items-center"
                            onPress={() => {
                              openMeet(event.roomUrl);
                            }}
                          >
                            <Text className="text-white font-medium">
                              Tham dự ngay
                            </Text>
                          </Pressable>
                        )}
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="items-center justify-center py-20">
                <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4 text-center">
                  Hiện không có sự kiện
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
