import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import * as ImagePicker from "expo-image-picker";
import { useAppStore } from "@/components/app-provider";
import { useUploadImage } from "@/queries/useS3";
import * as FileSystem from "expo-file-system";
import { useEditProfileMutation } from "@/queries/useUser";

export default function EditProfileScreen() {
  const profile = useAppStore((state) => state.profile);
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const uploadToS3 = useUploadImage();
  const uploadNewProfile = useEditProfileMutation();

  const [avatar, setAvatar] = useState(profile?.data.avatarUrl || "");
  const [firstName, setFirstName] = useState(profile?.data.firstName || "");
  const [lastName, setLastName] = useState(profile?.data.lastName || "");
  const [email, setEmail] = useState(profile?.data.email || "");
  const [phone, setPhone] = useState(profile?.data.phone || ""); // Thêm vào mock data
  const [address, setAddress] = useState(profile?.data.address || "");
  const [isUpdatable, setIsUpdatable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!profile) return;
    else if (
      avatar != profile.data.avatarUrl ||
      firstName != profile.data.firstName ||
      lastName != profile.data.lastName ||
      phone != profile.data.phone ||
      address != profile.data.address
    )
      setIsUpdatable(true);
  }, [avatar, lastName, firstName, phone, address]);

  const pickImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (newStatus !== "granted") {
        alert("Bạn cần cấp quyền truy cập thư viện ảnh trong cài đặt!");
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
        !email.trim() ||
        !phone.trim() ||
        !address.trim()
      ) {
        alert("Vui lòng nhập đầy đủ thông tin, không được để trống!");
        return;
      }

      // Kiểm tra số điện thoại Việt Nam hợp lệ
      const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
      if (!phoneRegex.test(phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
      }
      const newInfo = {
        avatarUrl: avatar,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        address: address,
        gender: profile?.data.gender || "MALE",
        dob: profile?.data.dob,
      };
      console.log("Dữ liệu hợp lệ, tiến hành cập nhật...");
      const res = await uploadNewProfile.mutateAsync({
        body: newInfo,
        token: token,
      });
      if (res) {
        alert("Cập nhật thông tin thành công!");
        setIsProcessing(false);
      } else {
        alert("Cập nhật thông tin thất bại!");
        setIsProcessing(false);
      }
    } catch (error) {
      alert(`Cập nhật thông tin thất bại! Lỗi: ${error}`);
      setIsProcessing(false);
      console.log("Lỗi khi cập nhật hồ sơ: ", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack title="Chỉnh sửa hồ sơ" returnTab={"/(tabs)/profile/profile"}/>

      <ScrollView className="flex-1 p-4">
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={{ uri: avatar }}
              className="w-24 h-24 rounded-full"
            />
            <Pressable
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
              onPress={pickImage}
            >
              <MaterialIcons name="camera-alt" size={18} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-1">Họ</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="bg-gray-50 p-4 rounded-xl text-gray-700"
              placeholder="Nhập họ"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-1">Tên</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="bg-gray-50 p-4 rounded-xl text-gray-700"
              placeholder="Nhập tên"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-1">Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              className="bg-gray-50 p-4 rounded-xl text-gray-700"
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-1">Địa chỉ</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              className="bg-gray-50 p-4 rounded-xl text-gray-700"
              placeholder="Nhập địa chỉ"
            />
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          className={`${(isUpdatable && !isProcessing) ? "bg-blue-500" : "bg-gray-500"} p-4 rounded-xl mt-8`}
          onPress={handleUpdate}
        >
          <Text className="text-white font-bold text-center">Lưu thay đổi</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
