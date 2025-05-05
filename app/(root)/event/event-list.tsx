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
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
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
  const profile = useAppStore((state) => state.profile);
  const [isProcessing, setIsProcessing] = useState(false);
  const notificationBadge = useAppStore((state) => state.notificationBadge);

  // Lấy initial từ tên người dùng
  const firstName = profile?.data?.firstName || "Bạn";
  const firstName_Initial = firstName ? firstName.charAt(0).toUpperCase() : "K";

  useFocusEffect(() => {
    refetch();
  });

  const statusStyles = useMemo(
    () => ({
      OPENING: {
        bgColor: "bg-green-500",
        textColor: "text-white",
        text: "Đang diễn ra",
      },
      PENDING: {
        bgColor: "bg-yellow-500",
        textColor: "text-white",
        text: "Chưa mở",
      },
      DONE: {
        bgColor: "bg-gray-400",
        textColor: "text-white",
        text: "Đã kết thúc",
      },
      CANCELLED: {
        bgColor: "bg-red-500",
        textColor: "text-white",
        text: "Đã hủy",
      },
    }),
    []
  );

  const openMeet = async (roomUrl: string | null) => {
    try {
      if (!roomUrl) roomUrl = "";
      setIsProcessing(true);
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

  const isOpenable = (eventStartAt: string, duration: number): boolean => {
    const now = new Date();
    const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const startTime = new Date(eventStartAt);
    const endDate = new Date(startTime.getTime() + duration * 1000);
    return (
      localTime.getTime() >= startTime.getTime() &&
      localTime.getTime() < endDate.getTime()
    );
  };

  const isClosed = (eventStartAt: string, duration: number): boolean => {
    const now = new Date();
    const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const startTime = new Date(eventStartAt);
    const endDate = new Date(startTime.getTime() + duration * 1000);
    return localTime.getTime() >= endDate.getTime();
  };

  const formatStartAtDisplay = (startAtDisplay: string): string => {
    const [timePart, datePart] = startAtDisplay.split("-");
    const [hour, minute] = timePart.split(":");
    const [day, month, year] = datePart.split("/");
    return `${hour}:${minute} - ${day}/${month}/${year}`;
  };

  const formatStartAt = (startAt: string): string => {
    const startAtOTC = new Date(startAt);
    const startAtGMT7 = new Date(startAtOTC.getTime() + 7 * 3600 * 1000);
    return startAtGMT7.toString();
  };

  const getEventStatus = (event: any) => {
    if (
      event.status.toUpperCase() === "OPENING" &&
      isClosed(formatStartAt(event.startedAt), event.durations)
    ) {
      return {
        bgColor: "bg-gray-400",
        textColor: "text-white",
        text: "Đã kết thúc",
      };
    }
    return statusStyles[
      event.status.toUpperCase() as keyof typeof statusStyles
    ];
  };

  return (
    <View className="flex-1 bg-[#f5f7f9]">
      <StatusBar style="dark" />

      {/* Header with gradient */}
      <LinearGradient
        colors={["#3b82f6", "#1d4ed8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-6 px-5"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.push("/(tabs)/home")}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={22} color="white" />
            </Pressable>
            <Text className="text-white text-lg font-bold ml-4">
              Sự kiện Koine
            </Text>
          </View>

          <Pressable
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.push("/(root)/notifications/notifications")}
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
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        {/* <View className="px-5 py-4">
                    <View className="flex-row items-center bg-white rounded-xl p-3 shadow-sm">
                        <MaterialIcons
                            name="search"
                            size={20}
                            color="#6b7280"
                        />
                        <Text className="ml-2 text-gray-500 flex-1">
                            Tìm kiếm sự kiện...
                        </Text>
                        <View className="bg-blue-100 rounded-full px-2.5 py-1">
                            <Text className="text-blue-700 text-xs font-medium">
                                {events ? events.data.length : 0}
                            </Text>
                        </View>
                    </View>
                </View> */}

        {/* Event List */}
        <View className="px-5 pt-1 pb-20">
          <Text className="text-xl font-bold mb-4">Tất cả sự kiện</Text>

          {events && events.data.length ? (
            <View className="space-y-5">
              {events.data.map((event) => (
                <Pressable
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                  onPress={() => {
                    router.push({
                      pathname: "/(root)/event/[id]",
                      params: { id: event.id },
                    });
                  }}
                  disabled={isProcessing}
                >
                  {/* Image Section */}
                  <View className="relative">
                    <Image
                      source={{ uri: event.imageUrl }}
                      className="w-full h-44"
                      style={{ resizeMode: "cover" }}
                    />
                    {/* Status Badge */}
                    <View
                      className={`absolute top-3 right-3 ${
                        getEventStatus(event)?.bgColor
                      } px-2.5 py-1 rounded-full`}
                    >
                      <Text
                        className={`${
                          getEventStatus(event)?.textColor
                        } text-xs font-medium`}
                      >
                        {getEventStatus(event)?.text}
                      </Text>
                    </View>
                  </View>

                  {/* Content Section */}
                  <View className="p-4">
                    <Text className="font-bold text-gray-900 text-lg mb-2">
                      {event.title}
                    </Text>
                    <Text className="text-gray-600 mb-3" numberOfLines={2}>
                      {event.description}
                    </Text>

                    {/* Event Info */}
                    <View className="space-y-2 mb-3">
                      <View className="flex-row items-center">
                        <Feather name="mic" size={16} color="#4B5563" />
                        <Text className="text-gray-700 ml-2">
                          {event.hostInfo.fullName}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <AntDesign name="calendar" size={16} color="#4B5563" />
                        <Text className="text-gray-700 ml-2">
                          {formatStartAtDisplay(event.startAtFormatted)}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <AntDesign
                          name="clockcircleo"
                          size={16}
                          color="#4B5563"
                        />
                        <Text className="text-gray-700 ml-2">
                          {formatDurationForString(event.durationsDisplay)}
                        </Text>
                      </View>
                    </View>

                    {/* Join Button - Only for active events */}
                    {isOpenable(
                      formatStartAt(event.startedAt),
                      event.durations
                    ) &&
                      event.status === "OPENING" && (
                        <Pressable
                          className="bg-green-500 py-2.5 rounded-full flex-row justify-center items-center"
                          onPress={() => openMeet(event.roomUrl)}
                          disabled={isProcessing}
                        >
                          <MaterialIcons
                            name="meeting-room"
                            size={18}
                            color="white"
                          />
                          <Text className="text-white font-medium ml-2">
                            Tham dự ngay
                          </Text>
                        </Pressable>
                      )}
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="py-16 items-center justify-center bg-white rounded-2xl border border-gray-100">
              <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                Hiện không có sự kiện nào
              </Text>
              <Text className="text-gray-400 text-center mb-4">
                Vui lòng quay lại sau
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
