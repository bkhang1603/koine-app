import { useAppStore } from "@/components/app-provider";
import { WHEREBY_API_KEY } from "@/config";
import { Text, View } from "react-native";

export default function CreateEvent() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken ? accessToken.accessToken : "";

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
          isLocked: true,
          roomMode: "group",
          endDate: endDateISO,
          fields: ["hostRoomUrl"],
          templateType: "viewerMode",
        }),
      });

      const text = await response.json();
      console.log("text ", text);

      // const roomId = data.roomUrl;

      const roomId = text.hostRoomUrl;

      // console.log("Thành công", `Room ID: ${roomId}`);
    //   setMeetingRoomId(roomId);

      // Gửi eventName & roomId về backend để lưu
      // fetch("YOUR_BACKEND_API/events", {
      //   method: "POST",
      //   body: JSON.stringify({ eventName, roomId })
      // });
    } catch (error) {
      console.error("Lỗi tạo phòng:", error);
    }
  };
  return (
    <View className="flex-1">
      <Text>ABC</Text>
    </View>
  );
}
