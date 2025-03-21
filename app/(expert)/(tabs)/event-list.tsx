import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { WHEREBY_API_KEY } from "@/config";
import * as WebBrowser from "expo-web-browser";

export default function EventListScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken ? accessToken.accessToken : "";

  //call api get event list theo token ở đây
  //có 1 nút để nhảy qua create event
  const mock = [
    {
      id: "1",
      roomId: "1a23av",
      hostId: "1",
      eventTitle: "Phát dục ở trẻ dậy thì",
      eventDescription:
        "Chuyên gia abc sẽ chia sẻ cho quý cha mẹ những kinh nghiệm nắm bắt tâm lí trẻ vị thành niên trong lứa tuổi dậy thì",
      hostName: "Jeffy Shnaider",
      imageUrl: "https://i.pravatar.cc/300",
      status: "PENDING", //chưa mở, đang diễn ra, đóng
      createAt: "2025-02-20",
      startedAt: "2025-03-27T22:30:00.000Z",
      startedAtFormatted: "22:30:00 - 27-03-2025",
      durations: 3600,
      durationDisplay: "1h",
      roomHostUrl: null,
      meetingId: null,
      roomName: null,
      roomUrl: null,
      roomSessionId: null,
      recordUrl: null,
      totalPaticipants: 0,
      note: null,
    },
    {
      id: "2",
      roomId: "1",
      hostId: "144vs2",
      eventTitle: "Nổi mụn ở trẻ dậy thì",
      eventDescription:
        "Chuyên gia abc sẽ chia sẻ cho quý cha mẹ những kinh nghiệm chăm sóc da cho trẻ thành niên trong lứa tuổi dậy thì",
      hostName: "Jeffy Shnaider",
      imageUrl: "https://i.pravatar.cc/300",
      status: "OPENING", //chưa mở, đang diễn ra, đóng
      createAt: "2025-03-21",
      startedAt: "2025-03-21T10:30:00.000Z",
      startedAtFormatted: "10:30:00 - 21-03-2025",
      durations: 7200,
      durationDisplay: "2h",
      roomHostUrl: null,
      meetingId: null,
      roomName: null,
      roomUrl: null,
      roomSessionId: null,
      recordUrl: null,
      totalPaticipants: 0,
      note: null,
    },
    {
      id: "3",
      roomId: "3nna32",
      hostId: "2",
      eventTitle: "Trò chuyện với trẻ ở dậy thì",
      eventDescription:
        "Chuyên gia abc sẽ chia sẻ cho quý cha mẹ những kinh nghiệm trò chuyện với trẻ vị thành niên trong lứa tuổi dậy thì",
      hostName: "Jeffy Shnaider",
      imageUrl: "https://i.pravatar.cc/300",
      status: "DONE", //chưa mở, đang diễn ra, đóng
      createAt: "2025-02-20",
      startedAt: "2025-03-20T10:30:00.000Z",
      startedAtFormatted: "10:30:00 - 20-03-2025",
      durations: 3600,
      durationDisplay: "1h",
      roomHostUrl: null,
      meetingId: null,
      roomName: null,
      roomUrl: null,
      roomSessionId: null,
      recordUrl: null,
      totalPaticipants: 0,
      note: null,
    },
  ];

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

  useFocusEffect(() => {
    // refetch();
    //refetch cái get eventList
  });

  const updateInfoToDB = async (roomName: string) => {
    try {
      const res = await getInsightsRoom(roomName);
      if (res) {
        const totalParticipants = res.totalUniqueParticipants;
        //call api update xong gửi về be xong
      }
    } catch (error) {}
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

  const createRoom = async (eventStartAt: string, duration: number) => {
    try {
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
          isLocked: false,
          roomMode: "group",
          endDate: endDateISO,
          fields: ["hostRoomUrl"],
          templateType: "viewerMode",
        }),
      });
      const text = await response.json();
      console.log("text ", text);
      const roomUrl = text.hostRoomUrl;
      await WebBrowser.openBrowserAsync(roomUrl);
    } catch (error) {
      console.error("Lỗi tạo phòng:", error);
    }
  };

  const openMeet = async (
    roomHostUrl: string | null,
    eventStartAt: string,
    duration: number
  ) => {
    if (!roomHostUrl || roomHostUrl.length == 0) {
      await createRoom(eventStartAt, duration);
    } else await WebBrowser.openBrowserAsync(roomHostUrl);
  };

  const isOpenable = (eventStartAt: string, duration: number): boolean => {
    const startTime = new Date(eventStartAt);
    const endDate = new Date(startTime.getTime() + duration * 1000); // duration tính theo giây
    const now = new Date();

    return now >= startTime && now <= endDate; // chỉ mở khi trong khoảng startTime -> endDate
  };

  const isReportable = (
    eventStartAt: string,
    totalParticipants: number
  ): boolean => {
    const startTime = new Date(eventStartAt);
    const now = new Date();
    return now >= startTime && totalParticipants != 0;
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Event screen of expert"
        showMoreOptions={false}
        returnTab="/(tabs)/profile/profile"
      ></HeaderWithBack>
      <View className="flex-row justify-center items-center">
        <Text className="p-2 font-bold text-xl text-center">
          Lịch trình sự kiện của expert
        </Text>
        <Pressable
          className={`p-2 border-black border-[1px] rounded-md 
              "bg-gray-300"`}
          onPress={() => {
            router.push("/(expert)/route/event/create-event");
          }}
        >
          <Text className={`text-black font-semibold text-lg text-center`}>
            Báo cáo
          </Text>
        </Pressable>
      </View>

      {mock && mock.length != 0 ? (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          className="p-1 bg-gray-200"
        >
          {mock.map((event) => (
            <View
              key={event.id}
              className="p-1 my-1 bg-white border-[1.5px] border-blue-500 rounded-lg"
            >
              <Image
                source={{ uri: event.imageUrl }}
                className="w-[96%] h-auto rounded-sm"
              />
              <View className="pl-1 pt-1">
                <Text className="font-semibold">{event.eventTitle}</Text>
                <Text className="">{event.eventDescription}</Text>
                <View className="flex-row justify-center items-center">
                  <MaterialIcons name="mic" size={24} color="black" />
                  <Text className="font-semibold ml-1">{event.hostName}</Text>
                </View>

                <View className="flex-row justify-center items-center">
                  <MaterialIcons
                    name="calendar-month"
                    size={24}
                    color="black"
                  />
                  <Text className="ml-1 font-semibold">
                    {event.startedAtFormatted}
                  </Text>
                </View>

                <View className="flex-row justify-center items-center">
                  <MaterialCommunityIcons
                    name="timer-sand"
                    size={24}
                    color="black"
                  />
                  <Text className="font-semibold">{event.durationDisplay}</Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="font-semibold">Trạng thái:</Text>
                  <View
                    className={`ml-1 p-1 ${
                      statusStyles[
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
                      {
                        statusStyles[
                          event.status.toUpperCase() as keyof typeof statusStyles
                        ]?.text
                      }
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row justify-center items-center">
                <Pressable
                  className={`mt-1 border-black border-[1px] rounded-md ${
                    isOpenable(event.startedAt, event.durations)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  disabled={isOpenable(event.startedAt, event.durations)}
                  onPress={() => {
                    openMeet(
                      event.roomHostUrl,
                      event.startedAt,
                      event.durations
                    );
                  }}
                >
                  <Text
                    className={`text-black font-semibold text-lg text-center`}
                  >
                    Tham dự
                  </Text>
                </Pressable>
                <Pressable
                  className={`mt-1 border-black border-[1px] rounded-md ${
                    isReportable(event.startedAt, event.totalPaticipants)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  disabled={isReportable(
                    event.startedAt,
                    event.totalPaticipants
                  )}
                  onPress={() => {
                    //call api báo cáo
                  }}
                >
                  <Text
                    className={`text-black font-semibold text-lg text-center`}
                  >
                    Báo cáo
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View>
          <Text>Hiện không có sự kiện</Text>
          <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
        </View>
      )}
    </View>
  );
}
