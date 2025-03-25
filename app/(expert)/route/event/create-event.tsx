import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useUploadImage } from "@/queries/useS3";
import { useCreateEventMutation } from "@/queries/useEvent";
import { router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateEventScreen() {
  const now = new Date();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken ? accessToken.accessToken : "";
  const uploadToS3 = useUploadImage();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState(
    new Date(now.getTime() + 7 * 60 * 60 * 1000)
  );

  const [displayTime, setDisplayTime] = useState(startAt.toLocaleString());

  const nowUtc = new Date(); // Lấy thời gian hiện tại theo UTC
  const nowGmt7 = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ để đúng với GMT+7

  const [processing, setProcessing] = useState(false);
  const createEvent = useCreateEventMutation();

  // Giới hạn độ tuổi (7 - 16 tuổi)
  const minDate = new Date(
    nowGmt7.getFullYear(),
    nowGmt7.getMonth(),
    nowGmt7.getDate()
  );
  minDate.setHours(
    nowGmt7.getHours(),
    nowGmt7.getMinutes(),
    nowGmt7.getSeconds(),
    0
  ); // Đặt giờ

  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [first, setFirst] = useState(true);
  const insets = useSafeAreaInsets();

  const [show, setShow] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const isValidTitle = title.length >= 10 && title.length <= 30;
  const isValidDescription = description.length >= 30;
  const isValidDuration =
    !isNaN(parseFloat(duration)) &&
    parseFloat(duration) >= 0.5 &&
    parseFloat(duration) < 3;

  const isValidStartAt =
    startAt.getTime() + 7 * 3600 * 1000 >= nowGmt7.getTime() + 7 * 1000 * 3600;
  const isFormValid =
    isValidTitle && isValidDescription && isValidDuration && isValidStartAt;

  const pickImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "Lỗi",
          "Bạn cần cấp quyền truy cập thư viện ảnh trong cài đặt!",
          [
            {
              text: "tắt",
              style: "cancel",
            },
          ]
        );
        return;
      }
    }

    // Mở trình chọn ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      selectionLimit: 1,
    });

    if (result.canceled || !result.assets?.length) return;

    const imageUri = result.assets[0].uri;
    try {
      const now = new Date();
      const seconds = now.getSeconds();

      const formData = new FormData();
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg", // Hoặc "image/png" nếu ảnh là PNG
        name: `event-${title + seconds}-thumbnail-upload.jpg`,
      } as any); // 👈 Sử dụng `{ uri, type, name }`

      const imageUrl = await uploadToS3.mutateAsync({ body: formData, token });

      setImageUrl(imageUrl.data[0]);
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
    }
  };

  function convertToDisplay(dateStr: string): string {
    // Tạo Date object từ chuỗi ISO 8601
    const [date, time] = dateStr.split("T");
    const [hour, minute, second] = time.split(":");
    const [year, month, day] = date.split("-");
    return `${hour}:${minute}:${second.substring(
      0,
      2
    )} ${day}-${month}-${year}`;
  }

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setFirst(false);
    if (event.type == "dismissed") {
      setShow(false);
      return;
    } else {
      if (selectedDate) {
        const newStartAt = new Date(selectedDate);
        newStartAt.setHours(nowGmt7.getHours(), nowGmt7.getMinutes(), 0, 0);
        setStartAt(newStartAt); // Cập nhật ngày khi chọn
        setDisplayTime(convertToDisplay(newStartAt.toISOString()));
        if (Platform.OS === "android") {
          setShow(false);
          setShowTimePicker(true); // Hiển thị picker chọn giờ trên Android
        }
      }
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (event.type == "dismissed") {
      setShowTimePicker(false);
      return;
    } else {
      if (selectedTime) {
        const pickedDate = new Date(selectedTime);
        pickedDate.setHours(nowGmt7.getHours(), nowGmt7.getMinutes(), 0, 0);
        setStartAt(selectedTime); // Cập nhật giờ
        setDisplayTime(
          convertToDisplay(
            new Date(selectedTime.getTime() + 7 * 3600 * 1000).toISOString()
          )
        );
      }
      setShowTimePicker(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (processing) return;
      setProcessing(true);
      const submitStartAt = new Date(
        startAt.getTime() + 7 * 3600 * 1000
      ).toISOString();

      const eventData = {
        title: title,
        description: description,
        startedAt: submitStartAt,
        imageUrl: imageUrl,
        durations: duration.includes(",")
          ? Math.round(parseFloat(duration.replace(",", ".")) * 3600)
          : Math.round(parseFloat(duration) * 3600), // Đổi giờ thành giây
      };
      console.log("Dữ liệu gửi:", eventData);
      const res = createEvent.mutateAsync({ body: eventData, token });

      // Gọi API tạo sự kiện ở đây (fetch / axios)
      Alert.alert("Thành công", "Sự kiện đã được tạo!");
    } catch (error) {
      Alert.alert("Lỗi", `Tạo sự kiện thất bại ${error}`);
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 500);
    }
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
      <Text className="text-[24px] font-bold mb-[10px] text-center mt-2">
        Tạo sự kiện mới
      </Text>
      <ScrollView className="flex-1 p-2" showsHorizontalScrollIndicator={false}>
        <View className="items-center py-6 ">
          <View className="relative">
            {imageUrl.length != 0 ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-72 h-52 rounded-md"
              />
            ) : (
              <View className="w-72 h-52 rounded-md border-black border-2">
                <Image
                  source={require("@/assets/images/default-my-course-banner.jpg")}
                  className="absolute w-full h-full rounded-sm"
                />
              </View>
            )}
            <Pressable
              className="absolute bottom-1 right-1 w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
              onPress={pickImage}
            >
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        <Text className="font-semibold mb-1">Tiêu đề sự kiện:</Text>
        <TextInput
          className="border-[1px] rounded-[5px] p-[10px] mb-[10px]"
          placeholder="Nhập tiêu đề..."
          value={title}
          onChangeText={setTitle}
        />
        {!isValidTitle && title.trim().length > 0 && (
          <Text className="text-red-500 mb-[10px]">
            Tiêu đề phải từ 10 đến 30 ký tự
          </Text>
        )}

        <Text className="font-semibold mb-1">Mô tả nội dung:</Text>
        <TextInput
          className="border-[1px] rounded-[5px] p-[10px] mb-[10px]"
          placeholder="Nhập mô tả..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {!isValidDescription && description.trim().length > 0 && (
          <Text className="text-red-500 mb-[10px]">
            Mô tả phải ít nhất 30 ký tự
          </Text>
        )}

        <Text className="font-semibold mb-1">Thời gian bắt đầu:</Text>
        <View>
          <View className="flex-row items-center">
            <View className="border  p-4 rounded-[5px] mb-[10px]">
              <Text className="text-black font-bold text-center">
                {displayTime}
              </Text>
            </View>
            <Pressable
              className="bg-cyan-200 p-3 rounded-xl ml-3 mb-3"
              onPress={() => setShow(true)}
            >
              <MaterialIcons name="calendar-month" size={30} color="black" />
            </Pressable>
          </View>

          {show && (
            <DateTimePicker
              value={startAt}
              mode="date"
              display="default"
              onChange={onChange}
              minimumDate={minDate}
            />
          )}

          {showTimePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={startAt}
              mode="time"
              display="default"
              onChange={onChangeTime}
              minimumDate={minDate}
            />
          )}
        </View>
        {!isValidStartAt && !first && (
          <Text className="text-red-500 mb-[10px]">
            Thời gian bắt đầu phải cách hiện tại ít nhất 7h
          </Text>
        )}

        <Text className="font-semibold mb-1">Thời lượng:</Text>
        <TextInput
          className="border-[1px] rounded-[5px] p-[10px] mb-[10px]"
          placeholder="Nhập số giờ... VD: 1.5 = 1h30p"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        {!isValidDuration && duration.trim().length > 0 && (
          <Text className="text-red-500 mb-[10px]">
            Thời lượng phải trong khoảng 30 phút đến 3 giờ
          </Text>
        )}
      </ScrollView>
      <View className="bg-gray-300 p-2 flex justify-center">
        <Pressable
          className={`p-2 ${
            isFormValid && !processing ? "bg-cyan-500" : "bg-gray-200"
          } rounded-xl`}
          onPress={handleCreateEvent}
          disabled={!isFormValid}
        >
          <Text className="text-center font-semibold text-lg">Tạo sự kiện</Text>
        </Pressable>
      </View>
    </View>
    </SafeAreaView>
  );
}
