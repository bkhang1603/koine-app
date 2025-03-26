import { useAppStore } from "@/components/app-provider";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { WHEREBY_API_KEY } from "@/config";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useCancelEventMutation,
  useEventForHost,
  useUpdateEventMutation,
  useUpdateEventWhenCreateRoomMutation,
} from "@/queries/useEvent";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { Portal, TextInput } from "react-native-paper";
import ChildLayout from "@/app/child/_layout";

export default function EventListScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken ? accessToken.accessToken : "";

  const {
    data: events,
    isLoading: eventLoading,
    isError: eventError,
    error: eventErrorMessage,
    refetch: refetchEvent,
  } = useEventForHost(token);

  if (eventLoading) console.log("loading");
  if (eventError) console.log("error ", eventErrorMessage);

  const updateRoomInfo = useUpdateEventWhenCreateRoomMutation();
  const updateEventInfo = useUpdateEventMutation();
  const cancelEvent = useCancelEventMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState<{
    eventId: string;
    view: boolean;
  }>({ eventId: "", view: false });

  const [noteItem, setNoteItem] = useState("");
  const [noteError, setNoteError] = useState("");

  // const mock = [
  //   {
  //     id: "1",
  //     title: "ông cố nội mày",
  //     description: "ông bà già nhà mày",
  //     startedAt: "2025-03-26T22:00:00Z",
  //     startAtFormatted: "22:00:00 26-03-2025",
  //     durations: 3600 * 5,
  //     durationsDisplay: "1.0h",
  //     imageUrl: "https://i.pravatar.cc/300?img=3",
  //     roomHostUrl:
  //       "https://koine.whereby.com/0269aa23-31ff-4e20-b9aa-2bea9cfd2ae2?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiI5ODgxOTU5OSIsInJvb21SZWZlcmVuY2UiOnsicm9vbU5hbWUiOiIvMDI2OWFhMjMtMzFmZi00ZTIwLWI5YWEtMmJlYTljZmQyYWUyIiwib3JnYW5pemF0aW9uSWQiOiIzMTI3NTcifSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zcnYud2hlcmVieS5jb20iLCJpYXQiOjE3NDMwMDI0MDgsInJvb21LZXlUeXBlIjoibWVldGluZ0hvc3QifQ.3A2yyjWGxLZC1Ku6b1NSFtGkM_j8Z6rspxHYGjOSpeY",
  //     roomName: "/0269aa23-31ff-4e20-b9aa-2bea9cfd2ae2",
  //     roomUrl: "https://koine.whereby.com/0269aa23-31ff-4e20-b9aa-2bea9cfd2ae2",
  //     recordUrl: "",
  //     status: "OPENING",
  //     totalParticipants: 0,
  //     createdAt: "2025-03-26T10:00:00Z",
  //     updateAt: "2025-03-26T10:00:00Z",
  //     hostInfo: {
  //       id: "1",
  //       fullName: "Nguyễn San",
  //       email: "nguyensan@gmail.com",
  //       avatarUrl: "https://i.pravatar.cc/300?img=3",
  //     },
  //   },
  //   {
  //     id: "2",
  //     title: "ông cố nội mày",
  //     description: "ông bà già nhà mày",
  //     startedAt: "2025-03-26T22:00:00Z",
  //     startAtFormatted: "22:00:00 26-03-2025",
  //     durations: 3600,
  //     durationsDisplay: "1.0h",
  //     imageUrl: "https://i.pravatar.cc/300?img=3",
  //     roomHostUrl: "",
  //     roomName: "",
  //     roomUrl: "",
  //     recordUrl: "",
  //     status: "PENDING",
  //     totalParticipants: 0,
  //     createdAt: "2025-03-26T22:00:00Z",
  //     updateAt: "2025-03-26T22:00:00Z",
  //     hostInfo: {
  //       id: "1",
  //       fullName: "Nguyễn San",
  //       email: "nguyensan@gmail.com",
  //       avatarUrl: "https://i.pravatar.cc/300?img=3",
  //     },
  //   },
  // ];

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

  const handleCancel = async (eventId: string, newNote: string) => {
    try {
      const body = {
        eventId: eventId,
        note: newNote,
      };
      console.log("body ", body);
      await cancelEvent.mutateAsync({ body: body, token });
      Alert.alert("Thành công", "Sự kiện đã được hủy");
    } catch (error) {
      Alert.alert("Lỗi", `Lỗi khi hủy sự kiện ${error}`);
    }
  };

  const updateInfoToDB = async (roomName: string | null, eventId: string) => {
    try {
      if (isProcessing) return;
      setIsProcessing(false);
      if (!roomName) roomName = "";
      const res = await getInsightsRoom(roomName);
      if (!res || res.results[0].length == 0) {
        Alert.alert("Thông báo", `Chưa có dữ liệu phòng họp`);
        return;
      }
      const totalParticipants = res.results[0].totalUniqueParticipants;
      if (!totalParticipants || totalParticipants == 0) {
        Alert.alert("Thông báo", `Chưa có dữ liệu phòng họp`);
        return;
      }
      await updateEventInfo.mutateAsync({
        body: { totalParticipants: totalParticipants, status: "DONE" },
        token,
        eventId,
      });
      Alert.alert("Thông báo", `Cập nhập dữ liệu phòng họp thành công`);
    } catch (error) {
      console.log("Lỗi khi báo cáo ", error);
      Alert.alert("Lỗi", `Lỗi khi báo cáo thông tin phòng họp ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getInsightsRoom = async (roomName: string) => {
    try {
      const response = await fetch(
        `https://api.whereby.dev/v1/insights/rooms?roomName=${encodeURIComponent(
          roomName
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${WHEREBY_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Insights Room Data:", data);
      return data;
    } catch (error) {
      console.error("Error when getting insight room:", error);
    }
  };

  const createRoom = async (
    eventStartAt: string,
    duration: number,
    eventId: string
  ) => {
    try {
      console.log("tạo phòng mới");
      const now = new Date(eventStartAt);
      const endDate = new Date(now.getTime() + duration * 1000);
      const endDateISO = endDate.toISOString();

      const response = await fetch("https://api.whereby.dev/v1/meetings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHEREBY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isLocked: true,
          roomMode: "group",
          endDate: endDateISO,
          fields: ["hostRoomUrl"],
          templateType: "viewerMode",
          roomAccess: "viewer",
        }),
      });
      const text = await response.json();
      console.log("text ", text);

      const body = {
        roomHostUrl: text.hostRoomUrl.toString(),
        roomName: text.roomName.toString(),
        roomUrl: text.roomUrl.toString(),
      };
      console.log("room data when create room ", body);
      await updateRoomInfo.mutateAsync({ body, token, eventId });
      const roomUrl = text.hostRoomUrl;
      await WebBrowser.openBrowserAsync(roomUrl);
      refetchEvent();
    } catch (error) {
      console.error("Lỗi tạo phòng:", error);
      Alert.alert("Lỗi", `Lỗi khi lưu thông tin phòng họp ${error}`);
    }
  };

  const openMeet = async (
    roomHostUrl: string | null,
    eventStartAt: string,
    duration: number,
    eventId: string
  ) => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      if (!roomHostUrl || roomHostUrl.length == 0) {
        await createRoom(eventStartAt, duration, eventId);
      } else {
        await WebBrowser.openBrowserAsync(roomHostUrl);
        refetchEvent();
        console.log("refetch rồi");
      }
    } catch (error) {
      console.log("Lỗi khi mở meet ", error);
    } finally {
      setIsProcessing(false);
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

  const isReportable = (
    startAt: string,
    totalParticipants: number,
    duration: number,
    eventStatus: string
  ): boolean => {
    if (eventStatus == "DONE" || eventStatus == "CANCELLED") return false;
    const startTime = new Date(startAt);
    const endTime = new Date(startTime.getTime() + duration * 1000);
    const now = new Date();
    // Chuyển giờ về GMT+7 (đảm bảo giờ giữ nguyên)
    const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return localTime.getTime() >= endTime.getTime() && totalParticipants == 0;
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white">
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
            {/* Tổng cộng: {mock.length} */}
          </Text>
          <Pressable
            className={`p-2 border-black border-[1px] rounded-md
              bg-gray-300 mr-2`}
            onPress={() => {
              router.push("/(expert)/route/event/create-event");
            }}
          >
            <Text className={`text-black font-semibold text-lg text-center`}>
              Tạo sự kiện
            </Text>
          </Pressable>
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
                  className="p-1 my-1 bg-gray-200 border-[1.5px] border-blue-500 rounded-lg"
                  onPress={() => {
                    const encodedData = encodeURIComponent(
                      JSON.stringify(event)
                    );
                    router.push({
                      pathname: "/(expert)/route/event/[id]",
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
                      <Text className="font-semibold text-lg">
                        {event.title}
                      </Text>
                      <Pressable
                        onPress={() => {
                          setShowModal({ eventId: event.id, view: true });
                        }}
                      >
                        <Feather name="delete" size={24} color="black" />
                      </Pressable>
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
                    (event.status == "OPENING" || event.status == "PENDING") ? (
                      <View>
                        <Pressable
                          className={`mt-1 border-black border-[1px] mx-3 rounded-lg px-2 ${
                            isOpenable(event.startedAt, event.durations) &&
                            (event.status == "OPENING" ||
                              event.status == "PENDING")
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                          disabled={
                            isOpenable(event.startedAt, event.durations) &&
                            (event.status == "OPENING" ||
                              event.status == "PENDING")
                              ? false
                              : true
                          }
                          onPress={() => {
                            openMeet(
                              event.roomHostUrl,
                              event.startedAt,
                              event.durations,
                              event.id
                            );
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
                    {isReportable(
                      event.startedAt,
                      event.totalParticipants,
                      event.durations,
                      event.status
                    ) ? (
                      <View>
                        <Pressable
                          className={`mt-1 border-black mx-3 border-[1px] rounded-lg px-2 ${
                            isReportable(
                              event.startedAt,
                              event.totalParticipants,
                              event.durations,
                              event.status
                            )
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                          disabled={
                            isReportable(
                              event.startedAt,
                              event.totalParticipants,
                              event.durations,
                              event.status
                            )
                              ? false
                              : true
                          }
                          onPress={() => {
                            //call api báo cáo
                            updateInfoToDB(event.roomName, event.id);
                          }}
                        >
                          <Text
                            className={`text-black font-semibold text-lg text-center`}
                          >
                            Báo cáo
                          </Text>
                        </Pressable>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                  <Portal>
                    <Modal
                      transparent={true}
                      visible={showModal.view}
                      onDismiss={() =>
                        setShowModal({ eventId: event.id, view: false })
                      }
                    >
                      <View className=" absolute top-[40%] w-[94%] flex bg-white border-2 border-gray-300 rounded-lg justify-center items-center self-center">
                        <Text className="text-center font-bold p-2">
                          Bạn có chắc chắn hủy sự kiện này không?
                        </Text>

                        <TextInput
                          className="w-[90%] border-[1px] border-gray-200 rounded-md mb-1 bg-black"
                          placeholder="Nhập lí do"
                          value={noteItem}
                          onChangeText={(text) => {
                            setNoteItem(text);
                            setNoteError(""); // Xóa lỗi khi nhập lại
                          }}
                        />

                        {noteError ? (
                          <Text className="text-red-500 ml-5 mb-3 self-start">
                            {noteError}
                          </Text>
                        ) : null}

                        <View className="flex-row justify-center items-center w-full">
                          <TouchableOpacity
                            className="p-3 mr-[5px] rounded-md mx-3"
                            onPress={() => {
                              setNoteItem("");
                              setNoteError("");
                              setShowModal({ eventId: event.id, view: false });
                            }}
                          >
                            <Text className="text-black font-bold">Hủy</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="p-3 ml-[5px] rounded-md mx-3"
                            onPress={async () => {
                              if (!noteItem.trim()) {
                                setNoteError("Không được bỏ trống");
                                return;
                              }
                              try {
                                if (isProcessing) return;
                                setIsProcessing(true);
                                await handleCancel(showModal.eventId, noteItem);
                                setShowModal({
                                  eventId: event.id,
                                  view: false,
                                });
                              } catch (error) {
                                Alert.alert(
                                  "Lỗi",
                                  `Lỗi khi hủy sự kiện: ${error}`
                                );
                              } finally {
                                setIsProcessing(false);
                              }
                            }}
                          >
                            <Text className="text-blue-500 font-bold">
                              Xác nhận
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </Portal>
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-center">Hiện không có sự kiện</Text>
              <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
            </View>
          )}
        </ScrollView>

        <View className="h-20" />
      </View>
    </SafeAreaView>
  );
}
