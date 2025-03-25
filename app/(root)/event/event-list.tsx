import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent } from "@/queries/useEvent";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";

export default function EventScreen() {
  const { data: events, isLoading, isError, error, refetch } = useEvent();

  if (isLoading) return <ActivityIndicatorScreen />;

  if (!events || events.data.length == 0 || isError) {
    console.log("Lỗi khi lấy eventlist", error);
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-gray-200">
          <View>
            <Text className="font-bold text-xl text-center">
              Danh sách sự kiện
            </Text>
            <Text className="ml-2">
              Đón chờ những sự kiện thú vị từ chúng tôi
            </Text>
          </View>
          <View className="flex-1 justify-center items-center">
            <Text className="text-center">Hiện không có sự kiện</Text>
            <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

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

  const openMeet = async (roomHostUrl: string | null) => {
    try {
      if (!roomHostUrl) roomHostUrl = "";
      await WebBrowser.openBrowserAsync(roomHostUrl);
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

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white">
        <View>
          <Text className="font-bold text-xl ml-2">Danh sách sự kiện</Text>
          <Text className="ml-2">
            Đón chờ những sự kiện thú vị từ chúng tôi
          </Text>
        </View>
        <View className="flex-row justify-between items-center  mt-1">
          <Text className="italic ml-2 text-cyan-600">
            Tổng cộng: {events.data.length}
          </Text>
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          className="p-1 bg-white"
        >
          {events.data.map((event) => (
            <Pressable
              key={event.id}
              className="p-1 my-1 bg-gray-200 border-[1.5px] border-blue-500 rounded-lg"
              onPress={() => {
                const encodedData = encodeURIComponent(JSON.stringify(event));
                router.push({
                  pathname: "/(root)/event/[id]",
                  params: { id: event.id, data: encodedData }, 
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
                  <Text className="font-semibold text-lg">{event.title}</Text>
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
                    {event.startAtFormatted}
                  </Text>
                </View>

                <View className="flex-row pl-[1.5px] py-1 items-center">
                  <AntDesign name="clockcircleo" size={21} color="black" />
                  <Text className="font-semibold pl-[5px]">
                    {event.durationsDisplay}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="font-semibold">Trạng thái:</Text>
                  <View
                    className={`ml-1 p-1 ${
                      event.status.toUpperCase() == "OPENING" &&
                      isClosed(event.startedAt, event.durations)
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
                      isClosed(event.startedAt, event.durations)
                        ? "Đã kết thúc"
                        : statusStyles[
                            event.status.toUpperCase() as keyof typeof statusStyles
                          ]?.text}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row justify-center items-center my-1">
                {isOpenable(event.startedAt, event.durations) &&
                event.status == "OPENING" ? (
                  <View>
                    <Pressable
                      className={`mt-1 border-black border-[1px] mx-3 rounded-lg px-2 ${
                        isOpenable(event.startedAt, event.durations) &&
                        event.status == "OPENING"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                      disabled={
                        isOpenable(event.startedAt, event.durations) &&
                        event.status == "OPENING"
                          ? false
                          : true
                      }
                      onPress={() => {
                        openMeet(event.roomHostUrl);
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
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
