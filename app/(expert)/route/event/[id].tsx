import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, Alert, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAppStore } from "@/components/app-provider";
import { useState } from "react";
import { useUploadFile } from "@/queries/useS3";
import { useEventDetail, useUpdateEventMutation } from "@/queries/useEvent";
import { EventDetailResType, getEventDetail } from "@/schema/event-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import WebView from "react-native-webview";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const insets = useSafeAreaInsets();
  const [webViewHeight, setWebViewHeight] = useState(0);
  const { data, isLoading, isError, error, refetch } = useEventDetail(
    token,
    id
  );

  useFocusEffect(() => {
    refetch();
  });

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

  const [processing, setProcessing] = useState(false);

  const uploadFileToS3 = useUploadFile();
  const updateEventInfo = useUpdateEventMutation();

  const [uploaded, setUploaded] = useState(
    eventDetail?.recordUrl ? true : false
  );

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
        eventId: eventDetail?.id || "",
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
              onPress={() => router.push("/(expert)/menu/event-list")}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>

            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2"
                onPress={() =>
                  router.push("/(expert)/route/notifications/notifications")
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
              onPress={() =>
                router.push("/(expert)/route/notifications/notifications")
              }
            >
              <MaterialIcons name="notifications" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      <ScrollView className="flex-1">
        <View className="flex-1">
          {/* Hiển thị thông tin sự kiện từ eventData */}

          <>
            <View className="flex-1">
              <Image
                source={{ uri: eventDetail.imageUrl }}
                className="w-full h-60"
              />

              <View className="p-2">
                <Text className="font-bold text-lg">{eventDetail.title}</Text>
                <Text className="ml-1">{eventDetail.description}</Text>

                <View className="flex-row  py-2">
                  <Feather name="mic" size={24} color="black" />
                  <Text className="font-semibold ml-1">
                    {eventDetail.hostInfo.fullName}
                  </Text>
                </View>

                <View className="flex-row  py-2 items-center">
                  <AntDesign name="calendar" size={24} color="black" />
                  <Text className="ml-1 font-semibold">
                    {eventDetail.startAtFormatted}
                  </Text>
                </View>

                <View className="flex-row pl-[1.5px] py-2 items-center">
                  <AntDesign name="clockcircleo" size={21} color="black" />
                  <Text className="font-semibold pl-[5px]">
                    {eventDetail.durationsDisplay}
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
                      isClosed(eventDetail.startedAt, eventDetail.durations)
                        ? "Đã kết thúc"
                        : statusStyles[
                            eventDetail.status.toUpperCase() as keyof typeof statusStyles
                          ]?.text}
                    </Text>
                  </View>
                </View>

                <View className="flex-row pl-[1.5px] py-2 items-center">
                  <FontAwesome name="file-video-o" size={24} color="black" />
                  <View
                    className={`${
                      uploaded || eventDetail.recordUrl.length != 0
                        ? "bg-gray-300"
                        : "bg-blue-400"
                    } ml-2 rounded-lg p-1`}
                  >
                    <Text className="font-semibold">
                      {uploaded || eventDetail.recordUrl.length != 0
                        ? "Đã chọn"
                        : "Chưa chọn"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {!isClosed(eventDetail.startedAt, eventDetail.durations) ? (
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
            <View className="flex-1 p-2">
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
          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
