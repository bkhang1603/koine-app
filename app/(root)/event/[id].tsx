import React, { useRef, useState } from "react";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import VideoPlayer from "@/components/video-player";
import { useAppStore } from "@/components/app-provider";
import { useEventDetail } from "@/queries/useEvent";
import { EventDetailResType, getEventDetail } from "@/schema/event-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import WebView from "react-native-webview";
import formatDurationForString from "@/util/formatDurationForString";

export default function EventDetailUser() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const insets = useSafeAreaInsets();
  const [webViewHeight, setWebViewHeight] = useState(0);
  const { data, isLoading, isError, error } = useEventDetail(token, id);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  const notificationBadge = useAppStore((state) => state.notificationBadge);
  const [unmountSignal, setUnmountSignal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      isMounted.current = true;
      return () => {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        isMounted.current = false;
        setUnmountSignal(true);
      };
    }, [])
  );


  const formatStartAt = (startAt: string): Date => {
    const startAtOTC = new Date(startAt);
    const startAtGMT7 = new Date(startAtOTC.getTime() + 7 * 3600 * 1000);
    return startAtGMT7;
  };

  const formatStartAtToDisplay = (startAt: string): string => {
    const startAtOTC = new Date(startAt);
    const startAtGMT7 = new Date(startAtOTC.getTime() + 7 * 60 * 60 * 1000);
    const hours = String(startAtGMT7.getUTCHours()).padStart(2, '0');
    const minutes = String(startAtGMT7.getUTCMinutes()).padStart(2, '0');
    const day = String(startAtGMT7.getUTCDate()).padStart(2, '0');
    const month = String(startAtGMT7.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = startAtGMT7.getUTCFullYear();
    return `${hours}:${minutes}-${day}/${month}/${year}`;
  };

  let eventDetail: EventDetailResType["data"] | null = null;

  if (data && !error) {
    if (data.data === null) {
    } else {
      const parsedResult = getEventDetail.safeParse(data);
      if (parsedResult.success) {
        eventDetail = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (isLoading) return <ActivityIndicatorScreen />;
  if (isError) console.log("Lỗi khi lấy event detail ", error);

  if (eventDetail == null) {
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
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.push("/(root)/event/event-list")}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={22} color="white" />
            </Pressable>
            <Text className="text-white text-lg font-bold ml-4">
              Chi tiết sự kiện
            </Text>
          </View>
        </LinearGradient>

        <View className="flex-1 items-center justify-center p-8">
          <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Không tìm thấy dữ liệu sự kiện
          </Text>
          <Text className="text-gray-400 text-center mb-4">
            Sự kiện có thể đã bị xóa hoặc không tồn tại
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-5 py-2.5 rounded-xl"
            onPress={() => router.push("/(root)/event/event-list")}
          >
            <Text className="text-white font-medium">Quay lại danh sách</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const statusStyles = {
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
  } as const;

  const isClosed = (eventStartAt: Date, duration: number): boolean => {
    const now = new Date();
    const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const startTime = new Date(eventStartAt);
    const endDate = new Date(startTime.getTime() + duration * 1000);
    return localTime.getTime() >= endDate.getTime();
  };


  const getEventStatus = () => {
    if (
      eventDetail?.status.toUpperCase() === "OPENING" &&
      isClosed(formatStartAt(eventDetail.startedAt), eventDetail.durations)
    ) {
      return {
        bgColor: "bg-gray-400",
        textColor: "text-white",
        text: "Đã kết thúc",
      };
    }
    return statusStyles[
      eventDetail?.status.toUpperCase() as keyof typeof statusStyles
    ];
  };

  

  const htmlContent = `
  <html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
          body {
              font-family: -apple-system, system-ui;
              font-size: 16px;
              line-height: 1.8;
              color: #374151;
              padding: 0;
              margin: 0;
              overflow-y: hidden;
          }
          
          h1, h2, h3 {
              color: #111827;
              margin-top: 1.8em;
              margin-bottom: 0.8em;
              font-weight: 600;
          }
          p {
              margin-bottom: 1.2em;
          }
          img {
              max-width: 100%;
              height: auto;
              border-radius: 12px;
              margin: 1.5em 0;
          }
          a {
              color: #2563eb;
              text-decoration: none;
          }
          blockquote {
              margin: 1.5em 0;
              padding: 1em 1.5em;
              border-left: 4px solid #2563eb;
              background: #f3f4f6;
              border-radius: 4px;
          }
      </style>
      <script>
          window.onload = function() {
              window.ReactNativeWebView.postMessage(
                  Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
              );
          }
      </script>
  </head>
  <body>
      ${eventDetail.content.trim() || ""}
  </body>
</html>
  `;

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
              onPress={() => router.push("/(root)/event/event-list")}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={22} color="white" />
            </Pressable>
            <Text className="text-white text-lg font-bold ml-4">
              Chi tiết sự kiện
            </Text>
          </View>

          <Pressable
            className="w-10 h-10 mr-1 rounded-full bg-white/20 items-center justify-center"
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Video or Image Section */}
        <View>
          {eventDetail.recordUrl && eventDetail.recordUrl.length > 0 ? (
            <View className="w-full">
              <VideoPlayer
                onUnmountSignal={unmountSignal}
                videoUrl={eventDetail.recordUrl}
              />
            </View>
          ) : (
            <Image
              source={{ uri: eventDetail.imageUrl }}
              className="w-full h-64"
              style={{ resizeMode: "cover" }}
            />
          )}

          {/* Status Badge */}
          <View
            className={`absolute top-3 right-3 ${
              getEventStatus()?.bgColor
            } px-3 py-1.5 rounded-full`}
          >
            <Text
              className={`${getEventStatus()?.textColor} text-xs font-medium`}
            >
              {getEventStatus()?.text}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="bg-white rounded-t-3xl -mt-5 px-5 pt-6 pb-2">
          <Text className="font-bold text-gray-900 text-xl mb-2">
            {eventDetail.title}
          </Text>

          <Text className="text-gray-600 mb-5">{eventDetail.description}</Text>

          {/* Event Info */}
          <View className="mb-5 p-4 bg-blue-50 rounded-xl">
            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                  <Feather name="mic" size={16} color="#3b82f6" />
                </View>
                <Text className="text-gray-800 font-medium ml-3">
                  {eventDetail.hostInfo.fullName}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                  <AntDesign name="calendar" size={16} color="#3b82f6" />
                </View>
                <Text className="text-gray-800 ml-3">
                  {formatStartAtToDisplay(eventDetail.startedAt)}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                  <AntDesign name="clockcircleo" size={16} color="#3b82f6" />
                </View>
                <Text className="text-gray-800 ml-3">
                  {formatDurationForString(eventDetail.durationsDisplay)}
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="mb-6">
            <Text className="font-bold text-gray-900 text-lg mb-3">
              Nội dung sự kiện
            </Text>
            <WebView
              source={{ html: htmlContent }}
              style={{
                height: webViewHeight,
                backgroundColor: "transparent",
              }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              scalesPageToFit={false}
              onMessage={(event) => {
                setWebViewHeight(parseInt(event.nativeEvent.data));
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
