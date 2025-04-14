import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEvent } from "@/queries/useEvent";
import formatDurationForString from "@/util/formatDurationForString";

export default function EventScreen() {
  const { data: events, isLoading, isError, error, refetch } = useEvent();
  const insets = useSafeAreaInsets();

  if (isLoading) console.log("loading");
  if (isError) console.log("error ", error);

  useFocusEffect(() => {
    refetch();
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const statusStyles = useMemo(
    () => ({
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

  const isOpenable = (eventStartAt: string, duration: number): boolean => {
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
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white">
        {/* Headers */}
        <View
          style={{ paddingTop: insets.top }}
          className="absolute top-0 left-0 right-0 z-10"
        >
          <View className="px-4 py-3 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.push("/child/(tabs)/home")}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>

            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2"
                onPress={() => router.push("/child/notifications")}
              >
                <MaterialIcons name="notifications" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
        <View className="h-5"></View>
        <View>
          <Text className="font-bold text-xl ml-2">Danh sách sự kiện</Text>
          <Text className="ml-2">
            Đón chờ những sự kiện thú vị từ chúng tôi
          </Text>
        </View>
        <View className="flex-row justify-between items-center  mt-1">
          <Text className="italic ml-2 text-cyan-600">
            Tổng cộng: {events ? events.data.length : 0}
          </Text>
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          className="p-1 bg-white"
        >
          {events && events.data.length ? (
            <View>
              {events.data.map((event) => (
                <Pressable
                  key={event.id}
                  className="p-1 my-1 bg-gray-200 border-[1.5px] border-black rounded-lg"
                  onPress={() => {
                    const encodedData = encodeURIComponent(
                      JSON.stringify(event)
                    );
                    router.push({
                      pathname: "/child/event/[id]" as any,
                      params: { id: event.id },
                    });
                  }}
                  disabled={isProcessing}
                >
                  <Image
                    source={{ uri: event.imageUrl }}
                    className="w-full h-56 rounded-md"
                  />

                  <View className="pl-1 pt-1">
                    <View className="flex-row justify-between items-center pr-1">
                      <Text className="font-semibold text-lg">
                        {event.title}
                      </Text>
                    </View>

                    <Text className="">{event.description}</Text>

                    <View className="flex-row  py-1">
                      <Feather name="mic" size={24} color="black" />
                      <Text className="font-semibold ml-1">
                        {event.hostInfo.fullName}
                      </Text>
                    </View>

                    <View className="flex-row  py-1 items-center">
                      <AntDesign name="calendar" size={24} color="black" />
                      <Text className="ml-1 font-semibold">
                        {formatStartAtDisplay(event.startAtFormatted)}
                      </Text>
                    </View>

                    <View className="flex-row pl-[1.5px] py-1 items-center">
                      <AntDesign name="clockcircleo" size={21} color="black" />
                      <Text className="font-semibold pl-[5px]">
                        {formatDurationForString(event.durationsDisplay)}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="font-semibold">Trạng thái:</Text>
                      <View
                        className={`ml-1 p-1 ${
                          event.status.toUpperCase() == "OPENING" &&
                          isClosed(
                            formatStartAt(event.startedAt),
                            event.durations
                          )
                            ? "bg-gray-300"
                            : statusStyles[
                                event.status.toUpperCase() as keyof typeof statusStyles
                              ]?.textBackgroundColor
                        } rounded-lg self-start`}
                      >
                        <Text
                          className={`${
                            statusStyles[
                              event.status.toUpperCase() as keyof typeof statusStyles
                            ]?.textColor
                          } font-semibold`}
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
                  </View>

                  <View className="flex-row justify-center items-center my-1">
                    {isOpenable(
                      formatStartAt(event.startedAt),
                      event.durations
                    ) && event.status == "OPENING" ? (
                      <View>
                        <Pressable
                          className={`mt-1  mx-3 rounded-lg px-2 ${
                            isOpenable(
                              formatStartAt(event.startedAt),
                              event.durations
                            ) && event.status == "OPENING"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                          disabled={
                            isOpenable(
                              formatStartAt(event.startedAt),
                              event.durations
                            ) && event.status == "OPENING"
                              ? false
                              : true
                          }
                          onPress={() => {
                            openMeet(event.roomUrl);
                          }}
                        >
                          <Text
                            className={`text-black font-semibold text-lg text-center`}
                          >
                            Tham dự
                          </Text>
                        </Pressable>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-center">Hiện không có sự kiện</Text>
              <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
            </View>
          )}
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
