import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/child/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useUploadImage } from "@/queries/useS3";
import { useEditProfileMutation } from "@/queries/useUser";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function EditProfileScreen() {
  const profile = useAppStore((state) => state.childProfile);
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const uploadToS3 = useUploadImage();
  const uploadNewProfile = useEditProfileMutation();

  const [isUpdatable, setIsUpdatable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!profile) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title="Chỉnh sửa thông tin"
          returnTab="/child/(tabs)/profile"
        />

        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="shopping-cart" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Tìm không thấy thông tin tài khoản
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/child/(tabs)/home")}
          >
            <Text className="text-white font-bold">Trở về trang chủ</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  const [avatar, setAvatar] = useState(profile?.avatarUrl || "");
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [dob, setDob] = useState(profile?.dob || "");
  const [date, setDate] = useState(convertDateFormat(dob) || new Date());

  function convertDateFormat(dateStr: string) {
    const [day, month, year] = dateStr.split("/");

    // Đảm bảo có đúng 2 chữ số cho tháng và ngày
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T00:00:00.000Z`;

    // Trả về Date object với giá trị UTC chuẩn
    return new Date(formattedDate);
  }

  function convertDateFormatToSubmit(dateStr: string): string {
    // Tạo Date object từ chuỗi ISO 8601
    const [month, day, year] = dateStr.split("/");
    return `${day}/${month}/${year}`;
  }

  const [gender, setGender] = useState(
    profile?.gender || ("" as "MALE" | "FEMALE" | "OTHER")
  );

  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === "ios"); // Ẩn picker nếu là Android
    if (!selectedDate) return;
    setDate(selectedDate);
    const submitDate = convertDateFormatToSubmit(
      selectedDate.toLocaleDateString()
    );
    setDob(submitDate);
  };

  useEffect(() => {
    if (!profile) return;
    else if (
      firstName != profile?.firstName ||
      lastName != profile?.lastName ||
      dob != profile?.dob ||
      avatar != profile?.avatarUrl ||
      gender != profile?.gender
    )
      setIsUpdatable(true);
  }, [avatar, lastName, firstName, dob, gender]);

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
        name: `${lastName + firstName + seconds}-avatar-upload.jpg`,
      } as any); // 👈 Sử dụng `{ uri, type, name }`

      const imageUrl = await uploadToS3.mutateAsync({ body: formData, token });

      setAvatar(imageUrl.data[0]);
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (isProcessing || !isUpdatable) return;
      setIsProcessing(true);
      // Trim() để loại bỏ khoảng trắng đầu & cuối
      if (
        !avatar.trim() ||
        !lastName.trim() ||
        !firstName.trim() ||
        !dob.trim() ||
        !gender.trim()
      ) {
        Alert.alert(
          "Lỗi",
          "Vui lòng nhập đầy đủ thông tin, không được để trống!",
          [
            {
              text: "tắt",
              style: "cancel",
            },
          ]
        );
        setIsProcessing(false);
        return;
      }
      const [day, month, year] = dob.split("/");
      const finalDob = `${month}/${day}/${year}`;
      const newInfo = {
        avatarUrl: avatar.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender: gender,
        dob: finalDob,
      };
      console.log("gender ", newInfo.gender);
      console.log("Dữ liệu hợp lệ, tiến hành cập nhật...");

      const res = await uploadNewProfile.mutateAsync({
        body: newInfo,
        token: token,
      });
      if (res) {
        Alert.alert("Thông báo", "Cập nhật thông tin thành công!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
      } else {
        Alert.alert("Thông báo", "Cập nhật thông tin thất bại!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
      }
    } catch (error) {
      Alert.alert("Lỗi", `${error}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Chỉnh sửa thông tin"
        returnTab="/child/(tabs)/profile"
      />

      <ScrollView className="flex-1">
        {/* Avatar Section */}
        <View className="items-center py-6 bg-violet-50">
          <View className="relative">
            <Image
              source={{ uri: avatar }}
              className="w-24 h-24 rounded-full"
            />
            <Pressable
              className="absolute bottom-0 right-0 w-8 h-8 bg-violet-500 rounded-full items-center justify-center"
              onPress={pickImage}
            >
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Form */}
        <View className="p-4 space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">Họ</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-4 bg-white"
              placeholder="Nhập họ"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Tên</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-4 bg-white"
              placeholder="Nhập tên"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Ngày sinh</Text>
            <View className="flex-row items-center">
              <View className="border border-gray-200 p-4 rounded-xl">
                <Text className="text-black font-bold text-center">{dob}</Text>
              </View>
              <Pressable
                className="bg-cyan-200 p-2 rounded-xl ml-3"
                onPress={() => setShow(true)}
              >
                <MaterialIcons name="calendar-month" size={24} color="black" />
              </Pressable>
            </View>

            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Giới tính</Text>
            <View className="flex-row space-x-4">
              <Pressable
                className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                  gender === "MALE"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onPress={() => setGender("MALE")}
              >
                <MaterialIcons
                  name="male"
                  size={24}
                  color={gender === "MALE" ? "#3B82F6" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    gender === "MALE" ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  Nam
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                  gender === "FEMALE"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200"
                }`}
                onPress={() => setGender("FEMALE")}
              >
                <MaterialIcons
                  name="female"
                  size={24}
                  color={gender === "FEMALE" ? "#EC4899" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    gender === "FEMALE" ? "text-pink-500" : "text-gray-600"
                  }`}
                >
                  Nữ
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="m-3">
        <Pressable
          className={`${
            isUpdatable && !isProcessing ? "bg-blue-500" : "bg-gray-500"
          } p-4 rounded-xl mt-8`}
          onPress={handleUpdate}
        >
          <Text className="text-white font-bold text-center">Lưu thay đổi</Text>
        </Pressable>
      </View>
    </View>
  );
}
