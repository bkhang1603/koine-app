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
import { router, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import * as ImagePicker from "expo-image-picker";
import { useUploadImage } from "@/queries/useS3";
import { useAppStore } from "@/components/app-provider";
import { useEditChildProfile, useMyChildCourses } from "@/queries/useUser";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useFocusEffect } from "expo-router";

export default function EditSubAccountScreen() {
  const { id } = useLocalSearchParams();
  const childs = useAppStore((state) => state.childs);
  const account = childs?.find((child) => child.id == id);
  const accessToken = useAppStore((state) => state.accessToken);
  const myCourse = useAppStore((state) => state.myCourses);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const editChild = useEditChildProfile();
  if (!account) return null;
  const {
    data: childCourse,
    isError,
    isLoading,
    refetch,
  } = useMyChildCourses({ childId: account.id, token: token });

  useFocusEffect(() => {
    refetch();
  });

  const nowUtc = new Date(); // Lấy thời gian hiện tại theo UTC
  const nowGmt7 = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ để đúng với GMT+7

  // Tính ngày giới hạn tuổi
  const minDate = new Date(
    nowGmt7.getFullYear() - 18,
    nowGmt7.getMonth(),
    nowGmt7.getDate()
  ); // Lớn nhất 18 tuổi
  const maxDate = new Date(
    nowGmt7.getFullYear() - 6,
    nowGmt7.getMonth(),
    nowGmt7.getDate()
  ); // Nhỏ nhất 6 tuổi

  const uploadToS3 = useUploadImage();

  if (!account) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title="Chỉnh sửa tài khoản con"
          returnTab={"/(root)/sub-accounts/sub-accounts"}
        />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="man" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Tài khoản con không tồn tại
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(root)/sub-accounts/create")}
          >
            <Text className="text-white font-bold">Đăng kí ngay?</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const [isUpdatable, setIsUpdatable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [avatar, setAvatar] = useState(account?.userDetail.avatarUrl || "");
  const [firstName, setFirstName] = useState(
    account?.userDetail.firstName || ""
  );
  const [lastName, setLastName] = useState(account?.userDetail.lastName || "");
  const [dob, setDob] = useState(
    convertToDisplay(account?.userDetail.dob) || ""
  );
  const [gender, setGender] = useState(
    account?.userDetail.gender || ("" as "MALE" | "FEMALE" | "OTHER")
  );
  const [date, setDate] = useState(convertDateFormat(dob) || new Date());

  function convertDateFormat(dateStr: string) {
    const [day, month, year] = dateStr.split("-");

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
    return `${day}-${month}-${year}`;
  }

  function convertToDisplay(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  function display(dateStr: string): string {
    const [month, day, year] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === "ios"); // Ẩn picker nếu là Android
    if (!selectedDate) return;
    setDate(selectedDate);
    const submitDate = convertDateFormatToSubmit(
      selectedDate.toLocaleDateString()
    );
    setDob(display(submitDate));
  };

  useEffect(() => {
    if (!account) return;
    else if (
      firstName != account?.userDetail.lastName ||
      lastName != account?.userDetail.lastName ||
      dob != account?.userDetail.dob ||
      avatar != account?.userDetail.avatarUrl ||
      gender != account?.userDetail.gender
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
        !gender.trim() ||
        !dob.trim()
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
      const [day, month, year] = dob.split("-");
      const finalDob = `${month}/${day}/${year}`;
      const newInfo = {
        avatarUrl: avatar.trim(),
        dob: finalDob.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender: gender.trim(),
      };
      console.log("ngày ", finalDob);
      const res = await editChild.mutateAsync({
        childId: account.id,
        body: newInfo,
        token: token,
      });
      if (res) {
        Alert.alert("Thông báo", "Cập nhật thông tin con thành công!", [
          {
            text: "tắt",
            style: "cancel",
            onPress: () => {
              router.back();
            },
          },
        ]);
        setIsProcessing(false);
      } else {
        Alert.alert("Thông báo", "Cập nhật thông tin con thất bại!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
      }
    } catch (error) {
      console.log("error ", error);
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
        title="Chỉnh sửa tài khoản con"
        returnTab={"/(root)/sub-accounts/sub-accounts"}
      />
      <ScrollView className="flex-1">
        {/* Avatar Section */}
        <View className="items-center py-6 bg-blue-50">
          <View className="relative">
            <Image
              source={{ uri: avatar }}
              className="w-24 h-24 rounded-full"
            />
            <Pressable
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
              onPress={pickImage}
            >
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Form Fields */}
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
                minimumDate={minDate}
                maximumDate={maxDate}
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

          {/* Learning Info */}
          <View className="bg-gray-50 p-4 rounded-xl mt-4">
            <Text className="font-bold mb-3">Thông tin học tập</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Khóa học đang học</Text>
              <Text className="font-medium">
                {childCourse?.data.courses?.length || 0}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Ngày tạo tài khoản</Text>
              <Text className="font-medium">{account.createdAtFormatted}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Bottom Bar */}
      <View className="p-4 border-t border-gray-100">
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
