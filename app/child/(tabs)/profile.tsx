import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_CHILD } from "@/constants/mock-data";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useAppStore } from "@/components/app-provider";

export default function ProfileScreen() {
  const user = useAppStore((state) => state.user);
  const profile = useAppStore(state => state.profile)
  const setRefreshExpired = useAppStore((state) => state.setRefreshExpired);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    // Định nghĩa hàm xử lý logout sau
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      setRefreshExpired(true);
      clearAuth();
      await SecureStore.deleteItemAsync("loginData");
      router.push("/(auth)/login");
      setTimeout(() => setIsProcessing(false), 1000);
    } catch (error) {
      console.log("Error when log out: ", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top SafeArea với background violet */}
      <View className="bg-violet-500">
        <SafeAreaView edges={["top"]} className="bg-violet-500" />
      </View>

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="bg-violet-500 pt-6 pb-20 px-4 rounded-b-[40px]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-xl font-bold">Hồ sơ của tôi</Text>
            <Pressable
              className="w-10 h-10 bg-violet-400 rounded-full items-center justify-center"
              onPress={() => router.push("/child/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Profile Card */}
        <View className="px-4 -mt-16">
          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-violet-100">
            <View className="items-center">
              <Image
                source={{ uri: profile?.data.avatarUrl }}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <Text className="text-xl font-bold mt-4">{profile?.data.lastName + " " + profile?.data.firstName}</Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="school" size={16} color="#7C3AED" />
                <Text className="text-violet-600 ml-1 font-medium">
                  Level {MOCK_CHILD.level}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row justify-between mt-6 bg-violet-50 rounded-2xl p-4">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-violet-600">
                  {MOCK_CHILD.points}
                </Text>
                <Text className="text-gray-600">Điểm</Text>
              </View>
              <View className="items-center flex-1 border-x border-violet-200">
                <Text className="text-2xl font-bold text-violet-600">
                  {MOCK_CHILD.streakDays}
                </Text>
                <Text className="text-gray-600">Ngày học</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-violet-600">
                  {MOCK_CHILD.activeCourses.length}
                </Text>
                <Text className="text-gray-600">Khóa học</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="mt-6">
            <Pressable
              className="flex-row items-center p-4 bg-white rounded-2xl mb-3 shadow-sm shadow-gray-100 border border-gray-50"
              onPress={() => router.push("/child/achievements")}
            >
              <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center">
                <MaterialIcons name="emoji-events" size={24} color="#F59E0B" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-bold">Thành tích</Text>
                <Text className="text-gray-600 text-sm">
                  Xem các thành tích đã đạt được
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </Pressable>

            <Pressable
              className="flex-row items-center p-4 bg-white rounded-2xl mb-3 shadow-sm shadow-gray-100 border border-gray-50"
              onPress={() => router.push("/child/settings")}
            >
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                <MaterialIcons name="settings" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-bold">Cài đặt</Text>
                <Text className="text-gray-600 text-sm">
                  Thay đổi cài đặt tài khoản
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </Pressable>

            <Pressable
              className="flex-row items-center p-4 bg-white rounded-2xl mb-3 shadow-sm shadow-gray-100 border border-gray-50"
              onPress={() => router.push("/child/profile/edit")}
            >
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                <MaterialIcons name="edit" size={24} color="#10B981" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-bold">Chỉnh sửa hồ sơ</Text>
                <Text className="text-gray-600 text-sm">
                  Cập nhật thông tin cá nhân
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </Pressable>

            <Pressable
              className="flex-row items-center p-4 bg-red-50 border border-slate-200 rounded-2xl mt-6"style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={handleLogout}
            >
              <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                <MaterialIcons name="logout" size={24} color={isProcessing ? "#808080" : "#EF4444"} />
              </View>
              <Text className={isProcessing ? "flex-1 ml-3 text-gray-500 font-medium" : "flex-1 ml-3 text-red-500 font-medium"}>
                Đăng xuất
              </Text>
            </Pressable>
          </View>
          <View className="h-20" />
        </View>
      </ScrollView>

      {/* Bottom SafeArea với background trắng */}
      <SafeAreaView edges={["bottom"]} className="bg-white h-10" />
    </View>
  );
}
