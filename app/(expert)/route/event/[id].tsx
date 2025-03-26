import HeaderWithBack from "@/components/HeaderWithBack";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  Alert,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAppStore } from "@/components/app-provider";
import { useState } from "react";
import { useUploadFile } from "@/queries/useS3";
import { useUpdateEventMutation } from "@/queries/useEvent";

export default function EventDetail() {
  const { id, data } = useLocalSearchParams();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [processing, setProcessing] = useState(false);

  const uploadFileToS3 = useUploadFile();
  const updateEventInfo = useUpdateEventMutation();
  const insets = useSafeAreaInsets();

  // Giải mã data từ chuỗi JSON đã mã hóa trong URL
  const eventData = data
    ? JSON.parse(decodeURIComponent(Array.isArray(data) ? data[0] : data))
    : null;

  const [uploaded, setUploaded] = useState(eventData.recordUrl ? true : false);

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

  const pickVideo = async () => {
    try {
      if (processing) return;
      setProcessing(true);
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Yêu cầu cấp quyền",
          "Bạn cần cấp quyền truy cập máy ảnh để tiếp tục"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"], // Sử dụng mảng thay vì MediaTypeOptions
        allowsEditing: false,
        quality: 1,
        selectionLimit: 1,
      });

      if (result.canceled || !result.assets?.length) return;
      console.log("Video URI:", result);
      // Upload video to server here
      const videoUri = result.assets[0].uri;

      // Lấy phần mở rộng video và định dạng lại tên file
      const fileName =
        result.assets[0].fileName || `video-${new Date().getTime()}.mp4`;
      const videoType = result.assets[0].mimeType || "video/mp4";

      const formData = new FormData();
      formData.append("file", {
        uri: videoUri,
        type: videoType, // Sử dụng mimeType của video
        name: fileName,
      } as any);

      const videoUrl = await uploadFileToS3.mutateAsync({
        body: formData,
        token,
      });
      console.log("video url ", videoUrl);

      const res = updateEventInfo.mutateAsync({
        body: { recordUrl: videoUrl.data },
        token,
        eventId: eventData.id,
      });
      setUploaded(true);
      Alert.alert("Thông báo", `Cập nhật bản ghi sự kiện thành công`);
    } catch (error) {
      console.log("Lỗi upload video", error);
      Alert.alert("Lỗi", `${error}`);
    } finally {
      setProcessing(false);
    }
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
            onPress={() => router.push("/(expert)/menu/event-list")}
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

                  <View className="flex-row pl-[1.5px] py-2 items-center">
                    <FontAwesome name="file-video-o" size={24} color="black" />
                    <View
                      className={`${
                        uploaded || eventData.recordUrl.length != 0
                          ? "bg-gray-300"
                          : "bg-blue-400"
                      } ml-2 rounded-lg p-1`}
                    >
                      <Text className="font-semibold">
                        {uploaded || eventData.recordUrl.length != 0
                          ? "Đã chọn"
                          : "Chưa chọn"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {!isClosed(eventData.startedAt, eventData.durations) ? (
                <></>
              ) : (
                <View className="w-full justify-center items-center mt-4">
                  <Pressable
                    className={`border-1 ${
                      !processing && !uploaded ? "bg-cyan-500" : "bg-gray-300"
                    }  p-2 rounded-lg w-[94%]`}
                    onPress={() => {
                      if (uploaded) {
                        Alert.alert(
                          "Thông báo",
                          "Nếu tải lên bản ghi mới, bản ghi cũ sẽ bị xóa",
                          [
                            {
                              text: "Hủy",
                              style: "cancel",
                            },
                            {
                              text: "Tải lên",
                              onPress: () => {
                                pickVideo();
                              },
                              style: "destructive",
                            },
                          ]
                        );
                      } else {
                        pickVideo();
                      }
                    }}
                  >
                    <Text className="text-center font-bold">
                      Tải lên bản ghi cuộc họp
                    </Text>
                  </Pressable>
                </View>
              )}
            </>
          ) : (
            <Text>Không có thông tin sự kiện</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
