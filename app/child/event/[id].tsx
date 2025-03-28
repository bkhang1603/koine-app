import VideoPlayer from "@/components/video-player";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function EventDetailUser() {
  const { id, data } = useLocalSearchParams();

  const insets = useSafeAreaInsets();

  // Giải mã data từ chuỗi JSON đã mã hóa trong URL
  const eventData = data
    ? JSON.parse(decodeURIComponent(Array.isArray(data) ? data[0] : data))
    : null;

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

  return (
    <SafeAreaView className="flex-1">
      {/* Headers */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/child/event/event")}
            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="flex-row items-center">
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2"
              onPress={() => router.push("/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      <ScrollView>
        <View>
          {/* Hiển thị thông tin sự kiện từ eventData */}
          {eventData ? (
            <>
              <View className="flex-1">
                <Image
                  source={{ uri: eventData.imageUrl }}
                  className="w-full h-60"
                />

                <View className="p-2">
                  <Text className="font-bold text-lg">{eventData.title}</Text>
                  <Text className="ml-1">{eventData.description}</Text>

                  <View className="flex-row  py-2">
                    <Feather name="mic" size={24} color="black" />
                    <Text className="font-semibold ml-1">
                      {eventData.hostInfo.fullName}
                    </Text>
                  </View>

                  <View className="flex-row  py-2 items-center">
                    <AntDesign name="calendar" size={24} color="black" />
                    <Text className="ml-1 font-semibold">
                      {eventData.startAtFormatted}
                    </Text>
                  </View>

                  <View className="flex-row pl-[1.5px] py-2 items-center">
                    <AntDesign name="clockcircleo" size={21} color="black" />
                    <Text className="font-semibold pl-[5px]">
                      {eventData.durationsDisplay}
                    </Text>
                  </View>

                  <View className="flex-row pl-[1.5px] py-2 items-center">
                    <Text className="font-semibold">Trạng thái:</Text>
                    <View
                      className={`ml-1 p-1 ${
                        statusStyles[
                          eventData.status.toUpperCase() as keyof typeof statusStyles
                        ]?.textBackgroundColor
                      } rounded-lg self-start`}
                    >
                      <Text
                        className={`${
                          statusStyles[
                            eventData.status.toUpperCase() as keyof typeof statusStyles
                          ]?.textColor
                        } font-semibold`}
                      >
                        {eventData.status.toUpperCase() == "OPENING" &&
                        isClosed(eventData.startedAt, eventData.durations)
                          ? "Đã kết thúc"
                          : statusStyles[
                              eventData.status.toUpperCase() as keyof typeof statusStyles
                            ]?.text}
                      </Text>
                    </View>
                  </View>
                </View>

                {eventData.recordUrl.length != 0 ? (
                  <View className="w-full">
                    <VideoPlayer videoUrl={eventData.videoUrl} />
                  </View>
                ) : (
                  <View className='p-2'>
                    <Text className="font-semibold text-lg">Sự kiện này không có bản ghi</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text>Không có thông tin sự kiện</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
