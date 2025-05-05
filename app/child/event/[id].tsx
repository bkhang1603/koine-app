import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { useAppStore } from "@/components/app-provider";
import VideoPlayer from "@/components/video-player";
import { useEventDetail } from "@/queries/useEvent";
import { EventDetailResType, getEventDetail } from "@/schema/event-schema";
import formatDurationForString from "@/util/formatDurationForString";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function EventDetailUser() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const insets = useSafeAreaInsets();
  const [webViewHeight, setWebViewHeight] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const { data, isLoading, isError, error } = useEventDetail(token, id);

  const notificationBadge = useAppStore((state) => state.notificationBadge);

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference to interval

  // Flag to track if component is mounted or focused
  const isMounted = useRef(true);

  //unmount signal send to video player to release
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

  if (isLoading) return <ActivityIndicatorScreen></ActivityIndicatorScreen>;
  if (isError) console.log("Lỗi khi lấy event detail ", error);

  if (eventDetail == null) {
    return (
      <View className="flex-1 bg-gray-50">
        {/* Top SafeArea */}
        <View className="bg-violet-500">
          <SafeAreaView edges={["top"]} className="bg-violet-500" />
        </View>

        {/* Header */}
        <View className="px-4 pt-4 pb-8 bg-violet-500">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>

            <Text className="text-white text-xl font-bold">
              Chi tiết sự kiện
            </Text>

            <Pressable
              className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
              onPress={() => setShowOptions(!showOptions)}
            >
              <MaterialIcons name="more-vert" size={24} color="white" />
            </Pressable>
          </View>

          {/* Options Menu */}
          {showOptions && (
            <View className="absolute right-4 top-20 bg-white rounded-xl shadow-md z-10 w-48">
              <Pressable
                className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                onPress={() => {
                  router.push("/child/event/event");
                  setShowOptions(false);
                }}
              >
                <MaterialIcons name="event" size={20} color="#8B5CF6" />
                <Text className="ml-2 text-gray-700">Danh sách sự kiện</Text>
              </Pressable>
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
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                onPress={() => {
                  router.push("/child/notifications");
                  setShowOptions(false);
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
              {/* <Pressable
                                className="px-4 py-3 flex-row items-center"
                                onPress={() => {
                                    router.push("/child/notifications");
                                    setShowOptions(false);
                                }}
                            >
                                <MaterialIcons
                                    name="notifications"
                                    size={20}
                                    color="#8B5CF6"
                                />
                                <Text className="ml-2 text-gray-700">
                                    Thông báo
                                </Text>
                            </Pressable> */}
            </View>
          )}
        </View>

        {/* Main Content with rounded top corners */}
        <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-6">
          <View className="flex-1 items-center justify-center p-4">
            <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              Không tìm thấy dữ liệu sự kiện
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
              color: #8B5CF6;
              text-decoration: none;
          }
          blockquote {
              margin: 1.5em 0;
              padding: 1em 1.5em;
              border-left: 4px solid #8B5CF6;
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

  const statusStyles = {
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
  } as const;

  const isClosed = (eventStartAt: string, duration: number): boolean => {
    const now = new Date();
    // Chuyển giờ về GMT+7 (đảm bảo giờ giữ nguyên)
    const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const startTime = new Date(eventStartAt);
    const endDate = new Date(startTime.getTime() + duration * 1000); // duration tính theo giây
    return localTime.getTime() >= endDate.getTime(); // chỉ mở khi trong khoảng startTime -> endDate
  };

  const formatStartAtDisplay = (startAtDisplay: string): string => {
    // Tách phần thời gian và ngày
    const [timePart, datePart] = startAtDisplay.split("-"); // "19:04:00", "09/04/2025"
    const [hour, minute, second] = timePart.split(":").map(Number);
    const [day, month, year] = datePart.split("/").map(Number);

    // Tạo đối tượng Date (chú ý: tháng trong JS bắt đầu từ 0)
    const date = new Date(year, month - 1, day, hour, minute, second);

    // Trừ đi 7 giờ
    date.setHours(date.getHours() - 7);

    // Format lại thành chuỗi "HH:mm:ss-DD/MM/YYYY"
    const pad = (n: number): string => n.toString().padStart(2, "0");
    const formatted = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}-${pad(date.getDate())}/${pad(
      date.getMonth() + 1
    )}/${date.getFullYear()}`;

    return formatted;
  };

  const formatStartAt = (startAt: string): string => {
    //2025-04-09T05:04:00.000Z
    const startAtOTC = new Date(startAt);
    const startAtGMT7 = new Date(startAtOTC.getTime() + 7 * 3600 * 1000);
    return startAtGMT7.toString();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top SafeArea */}
      <View className="bg-violet-500">
        <SafeAreaView edges={["top"]} className="bg-violet-500" />
      </View>

      {/* Header */}
      <View className="px-4 pt-4 pb-8 bg-violet-500">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Text className="text-white text-xl font-bold">Chi tiết sự kiện</Text>

          <Pressable
            className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
            onPress={() => setShowOptions(!showOptions)}
          >
            <MaterialIcons name="more-vert" size={24} color="white" />
          </Pressable>
        </View>

        {/* Options Menu */}
        {showOptions && (
          <View className="absolute right-4 top-20 bg-white rounded-xl shadow-md z-10 w-48">
            <Pressable
              className="px-4 py-3 border-b border-gray-100 flex-row items-center"
              onPress={() => {
                router.push("/child/event/event");
                setShowOptions(false);
              }}
            >
              <MaterialIcons name="event" size={20} color="#8B5CF6" />
              <Text className="ml-2 text-gray-700">Danh sách sự kiện</Text>
            </Pressable>
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
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => {
                router.push("/child/notifications");
                setShowOptions(false);
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
            {/* <Pressable
              className="px-4 py-3 flex-row items-center"
              onPress={() => {
                router.push("/child/notifications");
                setShowOptions(false);
              }}
            >
              <MaterialIcons name="notifications" size={20} color="#8B5CF6" />
              <Text className="ml-2 text-gray-700">Thông báo</Text>
            </Pressable> */}
          </View>
        )}
      </View>

      {/* Main Content with rounded top corners */}
      <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Video or Image */}
          {eventDetail.recordUrl && eventDetail.recordUrl.length > 0 ? (
            <View className="w-full">
              <VideoPlayer
                onUnmountSignal={unmountSignal}
                videoUrl={eventDetail.recordUrl}
              />
            </View>
          ) : (
            <View className="mx-4 mt-4">
              <Image
                source={{ uri: eventDetail.imageUrl }}
                className="w-full h-56 rounded-xl"
              />
            </View>
          )}

          {/* Event Information */}
          <View className="px-4 pt-4">
            {/* Event Status */}
            <View className="flex-row">
              <View
                className={`px-3 py-1 rounded-full ${
                  eventDetail.status.toUpperCase() == "OPENING" &&
                  isClosed(
                    formatStartAt(eventDetail.startedAt),
                    eventDetail.durations
                  )
                    ? "bg-gray-400"
                    : statusStyles[
                        eventDetail.status.toUpperCase() as keyof typeof statusStyles
                      ]?.backgroundColor
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    eventDetail.status.toUpperCase() == "OPENING" &&
                    isClosed(
                      formatStartAt(eventDetail.startedAt),
                      eventDetail.durations
                    )
                      ? "text-white"
                      : statusStyles[
                          eventDetail.status.toUpperCase() as keyof typeof statusStyles
                        ]?.textColor
                  }`}
                >
                  {eventDetail.status.toUpperCase() == "OPENING" &&
                  isClosed(
                    formatStartAt(eventDetail.startedAt),
                    eventDetail.durations
                  )
                    ? "Đã kết thúc"
                    : statusStyles[
                        eventDetail.status.toUpperCase() as keyof typeof statusStyles
                      ]?.text}
                </Text>
              </View>
            </View>

            {/* Event Title */}
            <Text className="font-bold text-xl mt-2 text-gray-900">
              {eventDetail.title}
            </Text>
            <Text className="mt-1 text-gray-600">
              {eventDetail.description}
            </Text>

            {/* Event Meta Information */}
            <View className="mt-4 bg-white p-4 rounded-xl shadow-sm">
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-violet-100 rounded-full items-center justify-center">
                    <Feather name="mic" size={16} color="#8B5CF6" />
                  </View>
                  <Text className="ml-3 text-gray-700">
                    <Text className="font-medium">Người tổ chức:</Text>{" "}
                    {eventDetail.hostInfo.fullName}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-violet-100 rounded-full items-center justify-center">
                    <AntDesign name="calendar" size={16} color="#8B5CF6" />
                  </View>
                  <Text className="ml-3 text-gray-700">
                    <Text className="font-medium">Thời gian:</Text>{" "}
                    {formatStartAtDisplay(eventDetail.startAtFormatted)}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-violet-100 rounded-full items-center justify-center">
                    <AntDesign name="clockcircleo" size={16} color="#8B5CF6" />
                  </View>
                  <Text className="ml-3 text-gray-700">
                    <Text className="font-medium">Thời lượng:</Text>{" "}
                    {formatDurationForString(eventDetail.durationsDisplay)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Event Content */}
            <View className="mt-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-lg font-bold text-gray-900">
                  Nội dung
                </Text>
                <View className="h-0.5 bg-violet-500 flex-1 ml-3"></View>
              </View>
              <View className="bg-white rounded-xl p-4 shadow-sm">
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

            {/* Padding at the bottom */}
            <View className="h-20"></View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
