import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useCreateChildMutation } from "@/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function CreateSubAccountScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [isProcessing, setIsProcessing] = useState(false);

  const [date, setDate] = useState(new Date(2010, 9, 20));
  const createChild = useCreateChildMutation();
  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    password: "",
    gender: "" as "MALE" | "FEMALE" | "OTHER",
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

  const [show, setShow] = useState(false);

  function convertDateFormat(dateStr: string): string {
    // Tạo Date object từ chuỗi ISO 8601
    const [month, day, year] = dateStr.split("/");
    return `${day}/${month}/${year}`;
  }

  function convertToSubmit(dateStr: string): string {
    // Tạo Date object từ chuỗi ISO 8601
    const [day, month, year] = dateStr.split("/");
    return `${year}/${day}/${month}`;
  }

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === "ios"); // Ẩn picker nếu là Android
    if (!selectedDate) return;
    setDate(selectedDate);
    const submitDate = convertDateFormat(selectedDate.toLocaleDateString());
    setFormData({ ...formData, dob: submitDate });
  };

  const handleCreate = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      if (
        !formData.dob.trim() ||
        !formData.password.trim() ||
        !formData.username.trim() ||
        !formData.gender.trim()
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

      const info = {
        dob: convertToSubmit(formData.dob),
        password: formData.password.trim(),
        username: formData.username.trim(),
        gender: formData.gender.trim(),
      };
      console.log(info);

      const res = await createChild.mutateAsync({
        body: info,
        token: token,
      });

      if (res) {
        Alert.alert("Thông báo", "Tạo tài khoản con thành công", [
          {
            text: "Tắt",
            onPress: async () => {
              setIsProcessing(false);
              router.push("/(root)/sub-accounts/sub-accounts");
            },
            style: "cancel",
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Lỗi", `${error}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Thêm tài khoản con"
        returnTab={"/(tabs)/profile/profile"}
      />
      <ScrollView className="flex-1 p-4">
        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">Tên đăng nhập</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-4"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text.replace(/\s+/g, "") })
              }
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Mật khẩu</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-4"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text.replace(/\s+/g, "") })
              }
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Ngày sinh</Text>
            <View className="flex-row items-center">
              <View className="border border-gray-200 p-4 rounded-xl">
                <Text className="text-black font-bold text-center">
                  {date.toLocaleDateString()}
                </Text>
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
                  formData.gender === "MALE"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onPress={() => setFormData({ ...formData, gender: "MALE" })}
              >
                <MaterialIcons
                  name="male"
                  size={24}
                  color={formData.gender === "MALE" ? "#3B82F6" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    formData.gender === "MALE"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  Nam
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                  formData.gender === "FEMALE"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200"
                }`}
                onPress={() => setFormData({ ...formData, gender: "FEMALE" })}
              >
                <MaterialIcons
                  name="female"
                  size={24}
                  color={formData.gender === "FEMALE" ? "#EC4899" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    formData.gender === "FEMALE"
                      ? "text-pink-500"
                      : "text-gray-600"
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
      <View className="p-4 border-t border-gray-100">
        <Pressable
          className={`p-4 rounded-xl ${
            !isProcessing &&
            formData.username &&
            formData.dob &&
            formData.gender
              ? "bg-blue-500"
              : "bg-gray-100"
          }`}
          onPress={handleCreate}
        >
          <Text
            className={`text-center font-bold ${
              !isProcessing &&
              formData.username &&
              formData.dob &&
              formData.gender
                ? "text-white"
                : "text-gray-400"
            }`}
          >
            Tạo tài khoản
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
