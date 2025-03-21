import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { WHEREBY_API_KEY } from "@/config";
import * as WebBrowser from "expo-web-browser";

export default function EventScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken ? accessToken.accessToken : "";

  //call api get event list ở đây get all
  const mock = [
    {
      id: "1",
      roomId: "1a23av",
      hostId: "1",
      eventTitle: "Phát dục ở trẻ dậy thì",
      eventDescription:
        "Chuyên gia abc sẽ chia sẻ cho quý cha mẹ những kinh nghiệm nắm bắt tâm lí trẻ vị thành niên trong lứa tuổi dậy thì",
      startTime: "22:30:00 - 29-10-2025",
      duration: "1 giờ",
      hostName: "Jeffy Shnaider",
      imageUrl: "https://i.pravatar.cc/300",
      status: "PENDING", //chưa mở, đang diễn ra, đóng
    },
    {
      id: "2",
      roomId: "1",
      hostId: "144vs2",
      eventTitle: "Nổi mụn ở trẻ dậy thì",
      eventDescription:
        "Chuyên gia abc sẽ chia sẻ cho quý cha mẹ những kinh nghiệm chăm sóc da cho trẻ thành niên trong lứa tuổi dậy thì",
      startTime: "22:30:00 - 29-10-2025",
      duration: "0.5 giờ",
      hostName: "Severus Shnape",
      imageUrl: "https://i.pravatar.cc/300",
      status: "OPENING", //chưa mở, đang diễn ra, đóng
    },
    {
      id: "3",
      roomId: "3nna32",
      hostId: "2",
      eventTitle: "Trò chuyện với trẻ ở dậy thì",
      eventDescription:
        "Chuyên gia abc sẽ chia sẻ cho quý cha mẹ những kinh nghiệm trò chuyện với trẻ vị thành niên trong lứa tuổi dậy thì",
      startTime: "19:30:00 - 22-10-2025",
      duration: "1.5 giờ",
      hostName: "Antony Shmave",
      imageUrl: "https://i.pravatar.cc/300",
      status: "DONE", //chưa mở, đang diễn ra, đóng
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
  } as const;

  const [meetingRoomId, setMeetingRoomId] = useState("");

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

  const createRoom = async () => {
    try {
      const now = new Date();
      const endDate = new Date(now.getTime() + 60 * 60 * 1000); // +1 giờ
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

      //ở đây tạo room xong sẽ có
      //hostRoomUrl và roomUrl trả về backend để lưu
      const roomId = text.hostRoomUrl;
      //lưu xong rồi thì mình có thể check được mảng id phòng + roomUrl + hostUrl + status để thay đổi ui từng item luôn
      //tạo phòng thành công thì lưu data về db chuyển vào trang meeting
      //khi thoát webbrowser về lại trang này thì trigger useFocusEffect refetch lại data khi đó thấy có roomId, meetId rồi thì k tạo nữa
      //kiểm tra thông tin của cuộc họp nếu endDate lớn hơn hiện tại thì update status trong db thành DONE
      //đang opening/done rồi thì k cho canncelled nữa
      //mỗi lần nó out ra thì đi check paticipants
      setMeetingRoomId(roomId);

      // Gửi eventName & roomId về backend để lưu
      // fetch("YOUR_BACKEND_API/events", {
      //   method: "POST",
      //   body: JSON.stringify({ eventName, roomId })
      // });
    } catch (error) {
      console.error("Lỗi tạo phòng:", error);
    }
  };

  const openMeet = async (eventId: string, roomUrl: string) => {
    if(!roomUrl || roomUrl.length == 0){
      await createRoom();
      //get data từ db bằng eventId
      //nếu bây giờ có room
    }
    await WebBrowser.openBrowserAsync(roomUrl);
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Event screen"
        showMoreOptions={false}
        returnTab="/(tabs)/profile/profile"
      ></HeaderWithBack>
      <View>
        <Text className="p-2 font-bold text-xl text-center">
          Lịch trình sự kiện
        </Text>
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
                <Text className="font-semibold">ICON: {event.hostName}</Text>
                <Text className="font-semibold">ICON: {event.startTime}</Text>
                <Text className="font-semibold">ICON: {event.duration}</Text>
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

              <Pressable
                className={`mt-1 border-black border-[1px] rounded-md ${
                  statusStyles[
                    event.status.toUpperCase() as keyof typeof statusStyles
                  ]?.backgroundColor
                }`}
                disabled={event.status == "OPENING" ? false : true}
                onPress={() => {
                  // router.push({
                  //   pathname: "/(root)/event/meeting",
                  //   params: { id: meetingRoomId },
                  // });
                  openMeet(event.id, event.roomId)
                }}
              >
                <Text
                  className={`${
                    statusStyles[
                      event.status.toUpperCase() as keyof typeof statusStyles
                    ]?.textColor
                  } font-semibold text-lg text-center`}
                >
                  Tham dự
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View>
          <Text>Hiện không có sự kiện</Text>
          <MaterialIcons name="event-busy" size={64} color="#9CA3AF" />
        </View>
      )}

      <Pressable
        className="p-2 border-2"
        onPress={() => {
          createRoom();
        }}
      >
        <Text className="text-center">Create meeting room</Text>
      </Pressable>
    </View>
  );
}
