import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Button,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useCreateChildMutation } from "@/queries/useAuth";
import { useAppStore } from "@/components/app-provider";

export default function CreateSubAccountScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const createChild = useCreateChildMutation();
  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    password: "",
    gender: "" as "MALE" | "FEMALE" | "",
  });

  const handleConfirm = (selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Chuyển về yyyy-mm-dd
    setFormData({ ...formData, dob: formattedDate });
  };

  const handleCreate = async () => {
    try {
      const res = await createChild.mutateAsync({
        body: formData,
        token: token,
      });
      if (res) {
        Alert.alert("Thông báo", "Tạo tài khoản con thành công", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setTimeout(() => {
          router.push("/(root)/sub-accounts/sub-accounts");
        }, 1000);
      }
    } catch (error) {
      Alert.alert("Lỗi", `${error}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Thêm tài khoản con"
        returnTab={"/(root)/sub-accounts/sub-accounts"}
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
                setFormData({ ...formData, username: text })
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
                setFormData({ ...formData, password: text })
              }
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Ngày sinh</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-4"
              placeholder="VD: 2000-01-01"
              value={formData.dob}
              onChangeText={(text) => setFormData({ ...formData, dob: text })}
            />
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
            formData.username && formData.dob && formData.gender
              ? "bg-blue-500"
              : "bg-gray-100"
          }`}
          disabled={!formData.username || !formData.dob || !formData.gender}
          onPress={handleCreate}
        >
          <Text
            className={`text-center font-bold ${
              formData.username && formData.dob && formData.gender
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
