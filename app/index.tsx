import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "./../constants/colors";
import { router } from "expo-router";
import { useAppStore } from "@/components/app-provider";
import { RoleValues } from "@/constants/type";

export default function Index() {
  const isRefreshExpired = useAppStore((state) => state.isRefreshExpired);
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái nút
  const user = useAppStore((state) => state.user);

  const handlePress = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (isRefreshExpired || !user) {
      router.push("/(auth)/login");
    } else {
      if (user.role == RoleValues[0]) {
        router.push("/(tabs)/home");
      } else if (user.role == RoleValues[3]) {
        router.push("/child/(tabs)/home");
      }
    }
    setTimeout(() => setIsProcessing(false), 1000);
  };

  return (
    <View className="flex-1">
      <Image
        source={require("./../assets/images/login.jpg")}
        className="w-full h-2/3"
      />

      <View className="p-6 mt-[-20px] bg-white h-2/3 rounded-t-3xl">
        <Text className="text-2xl font-bold text-center">
          Chào mừng đến với Koine
        </Text>

        <TouchableOpacity
          onPress={handlePress}
          className="w-full p-5 bg-black rounded-full mt-5"
        >
          <Text className="text-center text-white">Bắt đầu</Text>
        </TouchableOpacity>

        <Text className="text-center mt-5 text-xs text-gray-500">
          Tiếp tục sẽ chấp nhận các chính sách của chúng tôi.
        </Text>
      </View>
    </View>
  );
}