import React, { useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/components/auth";
import { MOCK_USER } from "@/constants/mock-data";
import { useState } from "react";
import { useAppStore } from "@/components/app-provider";
import * as SecureStore from "expo-secure-store";
import { useUserProfile } from "@/queries/useUser";
import { RoleValues } from "@/constants/type";

const MENU_ITEMS = [
  {
    id: "sub-accounts",
    title: "Quản lý tài khoản con",
    icon: "people",
    route: "/sub-accounts/sub-accounts",
    badge: MOCK_USER.subAccounts.length.toString(),
  },
  {
    id: "my-courses",
    title: "Khóa học đã mua",
    icon: "school",
    route: "/purchased-courses/purchased-courses",
  },
  {
    id: "orders",
    title: "Đơn hàng",
    icon: "receipt-long",
    route: "/orders/orders",
  },
  {
    id: "certificates",
    title: "Chứng chỉ",
    icon: "card-membership",
    route: "/certificates/certificates",
  },
  {
    id: "event",
    title: "Sự kiện",
    icon: "event-available",
    route: "/(root)/event/event-list",
  },
  {
    id: "notifications",
    title: "Thông báo",
    icon: "notifications",
    route: "/(root)/notifications/notifications",
  },
  {
    id: "settings",
    title: "Cài đặt",
    icon: "settings",
    route: "/profile/settings",
  },
];

export default function ProfileScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const childs = useAppStore((state) => state.childs);
  const user = useAppStore((state) => state.user);

  const profile = useAppStore((state) => state.profile);
  const setRefreshExpired = useAppStore((state) => state.setRefreshExpired);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const myCourse = useAppStore((state) => state.myCourses);
  const totalPurchased = myCourse?.data.totalItem;

  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái nút

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
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Profile Header */}
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
                onPress={() => router.push("/profile/edit-profile" as any)}
              >
                <MaterialIcons name="edit" size={20} color="#374151" />
              </Pressable>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row px-4 mt-6">
            <View className="flex-1 bg-blue-100 rounded-xl p-4 mr-2">
              <View className="flex-row">
                <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mb-2">
                  <MaterialIcons name="people" size={24} color="#fff" />
                </View>
                <Text className="text-2xl font-bold ml-2">
                  {childs?.length}
                </Text>
              </View>

              <Text className="text-gray-600">Tài khoản con</Text>
            </View>

            <View className="flex-1 bg-green-100 rounded-xl p-4 ml-2">
              <View className="flex-row">
                <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mb-2">
                  <MaterialIcons name="school" size={24} color="#fff" />
                </View>
                <Text className="text-2xl font-bold ml-2">
                  {totalPurchased}
                </Text>
              </View>

              <Text className="text-gray-600">Khóa học đã mua</Text>
            </View>
          </View>

          {/* Sub Accounts Preview */}
          <View className="mt-6 px-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold">Tài khoản con</Text>
              <Pressable
                className="flex-row items-center"
                onPress={() => router.push("/sub-accounts/sub-accounts")}
              >
                <Text className="text-blue-500 mr-1">Xem tất cả</Text>
                <MaterialIcons name="chevron-right" size={20} color="#3B82F6" />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            >
              {/* Add Account Button */}
              <Pressable
                className="w-24 bg-gray-50 rounded-xl items-center justify-center mr-3 border-2 border-dashed border-gray-200"
                onPress={() => router.push("/(root)/sub-accounts/create")}
              >
                <MaterialIcons name="person-add" size={24} color="#3B82F6" />
                <Text className="text-blue-500 text-center mt-2 text-sm">
                  Thêm tài khoản
                </Text>
              </Pressable>

              {/* Sub Accounts */}
              {childs?.map((account) => (
                <Pressable
                  key={account.id}
                  className="w-24 items-center mr-3"
                  onPress={() =>
                    router.push({
                      pathname: "/sub-accounts/[id]",
                      params: { id: account.id },
                    })
                  }
                >
                  <Image
                    source={{ uri: account.userDetail.avatarUrl }}
                    className="w-24 h-24 rounded-full"
                  />
                  <Text className="font-medium mt-2 text-center" numberOfLines={2}>
                    {account.userDetail.lastName +
                      " " +
                      account.userDetail.firstName}
                  </Text>
                  <Text className="text-gray-600">
                    {new Date().getFullYear() -
                      new Date(account.userDetail.dob).getFullYear()}{" "}
                    tuổi
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
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
                {item.badge && (
                  <View className="flex items-center bg-blue-100 w-8 h-8 px-2 py-1 rounded-full mr-2">
                    <Text className="text-blue-600 text-sm">
                      {childs?.length}
                    </Text>
                  </View>
                )}
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
          <View className="h-10" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
