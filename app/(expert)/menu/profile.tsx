import { useAppStore } from "@/components/app-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ITEMS = [
  {
    id: "approve-course",
    title: "Khóa học cần duyệt",
    icon: "school",
    route: "/(expert)/menu/approve-course",
  },
  {
    id: "event-list",
    title: "Danh sách sự kiện",
    icon: "event-note",
    route: "/(expert)/menu/event-list",
  },
  {
    id: "notifications",
    title: "Thông báo",
    icon: "notifications",
    route: "/(expert)/route/notifications/notifications",
  },
  {
    id: "settings",
    title: "Cài đặt",
    icon: "settings",
    route: "/(expert)/route/profile/settings",
  },
];

export default function ProfileScreen() {
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái nút
  const setRefreshExpired = useAppStore((state) => state.setRefreshExpired);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const profile = useAppStore((state) => state.profile);

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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView className="pb-[20px]">
          <View className="px-4 pt-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: profile?.data.avatarUrl }}
                className="w-20 h-20 rounded-full"
              />
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold">
                  {profile?.data.lastName + " " + profile?.data.firstName}
                </Text>

                <Text className="text-gray-600">{profile?.data.email}</Text>
              </View>
              <Pressable
                className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                onPress={() => router.push("/(expert)/route/profile/edit")}
              >
                <MaterialIcons name="edit" size={20} color="#374151" />
              </Pressable>
            </View>
          </View>

          {/* Menu Items */}
          <View className="px-4">
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                className="flex-row items-center py-4 border-t border-gray-100"
                onPress={() => router.push(item.route as any)}
              >
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color="#374151"
                  />
                </View>
                <Text className="flex-1 font-medium ml-3">{item.title}</Text>
                <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
              </Pressable>
            ))}

            {/* Logout Button */}
            <Pressable
              className="flex-row items-center py-4 border-t border-gray-100"
              onPress={handleLogout}
            >
              <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                <MaterialIcons
                  name="logout"
                  size={24}
                  color={isProcessing ? "#808080" : "#EF4444"}
                />
              </View>
              <Text
                className={
                  isProcessing
                    ? "flex-1 font-medium ml-3 text-gray-500"
                    : "flex-1 font-medium ml-3 text-red-500"
                }
              >
                Đăng xuất
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
