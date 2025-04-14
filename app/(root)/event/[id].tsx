import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import VideoPlayer from "@/components/video-player";
import { useAppStore } from "@/components/app-provider";
import { useEventDetail } from "@/queries/useEvent";
import { EventDetailResType, getEventDetail } from "@/schema/event-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import WebView from "react-native-webview";
import React, { useRef, useState } from "react";
import formatDurationForString from "@/util/formatDurationForString";

export default function EventDetailUser() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const insets = useSafeAreaInsets();
  const [webViewHeight, setWebViewHeight] = useState(0);
  const { data, isLoading, isError, error} = useEventDetail(
    token,
    id
  );

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
      <SafeAreaView className="flex-1">
        {/* Headers */}
        <View
          style={{ paddingTop: insets.top }}
          className="absolute top-0 left-0 right-0 z-10"
        >
          <View className="px-4 py-3 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.push("/(root)/event/event-list")}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>

            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2"
                onPress={() =>
                  router.push("/(root)/notifications/notifications")
                }
              >
                <MaterialIcons name="notifications" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Không tìm thấy dữ liệu sự kiện
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyles = {
    OPENING: {
      textBackgroundColor: "bg-green-500",
      text: "Đang diễn ra",
      textColor: "black",
      backgroundColor: "bg-green-500",
    },
    PENDING: {
      textBackgroundColor: "bg-yellow-500",
      text: "Chưa mở",
      textColor: "black",
      backgroundColor: "bg-gray-300",
    },
    DONE: {
      textBackgroundColor: "bg-gray-300",
      text: "Đã kết thúc",
      textColor: "black",
      backgroundColor: "bg-gray-300",
    },
    CANCELLED: {
      textBackgroundColor: "bg-gray-300",
      text: "Đã hủy",
      textColor: "black",
      backgroundColor: "bg-gray-300",
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Headers */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/(root)/event/event-list")}
            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="flex-row items-center">
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2"
              onPress={() => router.push("/(root)/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-1">
          {/* Hiển thị thông tin sự kiện từ eventData */}
          {eventDetail ? (
            <View className="flex-1">
              {/* Video */}
              {eventDetail.recordUrl && eventDetail.recordUrl.length > 0 ? (
                <View className="w-full">
                  <VideoPlayer  onUnmountSignal={unmountSignal}  videoUrl={eventDetail.recordUrl} />
                </View>
              ) : (
                <Image
                  source={{ uri: eventDetail.imageUrl }}
                  className="w-full h-72"
                />
              )}

              <View className="p-2">
                <Text className="font-bold text-xl">{eventDetail.title}</Text>
                <Text className="ml-1">{eventDetail.description}</Text>

                <View className="flex-row py-2">
                  <Feather name="mic" size={24} color="black" />
                  <Text className="font-semibold ml-1">
                    {eventDetail.hostInfo.fullName}
                  </Text>
                </View>

                <View className="flex-row  py-2 items-center">
                  <AntDesign name="calendar" size={24} color="black" />
                  <Text className="ml-1 font-semibold">
                    {formatStartAtDisplay(eventDetail.startAtFormatted)}
                  </Text>
                </View>

                <View className="flex-row pl-[1.5px] py-2 items-center">
                  <AntDesign name="clockcircleo" size={21} color="black" />
                  <Text className="font-semibold pl-[5px]">
                    {formatDurationForString(eventDetail.durationsDisplay)}
                  </Text>
                </View>

                <View className="flex-row pl-[1.5px] py-2 items-center">
                  <Text className="font-semibold">Trạng thái:</Text>
                  <View
                    className={`ml-1 p-1 ${
                      statusStyles[
                        eventDetail.status.toUpperCase() as keyof typeof statusStyles
                      ]?.textBackgroundColor
                    } rounded-lg self-start`}
                  >
                    <Text
                      className={`${
                        statusStyles[
                          eventDetail.status.toUpperCase() as keyof typeof statusStyles
                        ]?.textColor
                      } font-semibold`}
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
              </View>
            </View>
          ) : (
            <Text>Không có thông tin sự kiện</Text>
          )}
        </View>
        <View className="flex-1 p-2">
          <Text className="font-semibold ml-1">Trạng thái:</Text>
          <View className="mt-4">
            <WebView
              source={{ html: htmlContent }}
              style={{ height: webViewHeight }}
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
    </SafeAreaView>
  );
}
