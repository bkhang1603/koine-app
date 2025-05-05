import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useState } from "react";
import { useAppStore } from "@/components/app-provider";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { childs } from "@/model/child";

const MENU_ITEMS = [
  {
    id: "sub-accounts",
    title: "Quản lý tài khoản con",
    icon: "people",
    route: "/sub-accounts/sub-accounts",
    badge: childs?.length.toString(),
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
    id: "products",
    title: "Sản phẩm",
    icon: "shopping-cart",
    route: "/product/product",
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

  const firstName = profile?.data.firstName || "User";
  const lastName = profile?.data.lastName || "";
  const firstName_Initial = firstName ? firstName.charAt(0).toUpperCase() : "K";

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
    <View className="flex-1 bg-[#f5f7f9]">
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section - Modern Gradient */}
        <LinearGradient
          colors={["#3b82f6", "#1d4ed8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-14 pb-8 px-5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
                <Image
                  source={{
                    uri: profile?.data.avatarUrl,
                  }}
                  className="w-16 h-16 rounded-full"
                />
              </View>
              <View>
                <Text className="text-white/80 text-sm font-medium">
                  Tài khoản
                </Text>
                <Text className="text-white text-lg font-bold">
                  {lastName} {firstName}
                </Text>
              </View>
            </View>

            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
              onPress={() => router.push("/profile/edit-profile" as any)}
            >
              <MaterialIcons name="edit" size={20} color="white" />
            </Pressable>
          </View>

          <View className="flex-row mt-4">
            <View className="flex-1 bg-white/20 rounded-xl p-4 mr-2">
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="people" size={18} color="white" />
                <Text className="text-white/90 ml-1 text-sm">
                  Tài khoản con
                </Text>
              </View>
              <Text className="text-white text-xl font-bold">
                {childs?.length || 0}
              </Text>
            </View>

            <View className="flex-1 bg-white/20 rounded-xl p-4 ml-2">
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="school" size={18} color="white" />
                <Text className="text-white/90 ml-1 text-sm">Khóa học</Text>
              </View>
              <Text className="text-white text-xl font-bold">
                {totalPurchased || 0}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Sub Accounts Preview - Modernized */}
        <View className="px-5 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Tài khoản con
            </Text>
            <Pressable
              className="flex-row items-center"
              onPress={() => router.push("/sub-accounts/sub-accounts")}
            >
              <Text className="text-blue-500 mr-1 font-medium">Xem tất cả</Text>
              <MaterialIcons name="chevron-right" size={20} color="#3B82F6" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {/* Add Account Button - Improved Design */}
            <Pressable
              className="w-24 bg-white rounded-xl mr-3 shadow-sm border border-gray-100 overflow-hidden"
              onPress={() => router.push("/(root)/sub-accounts/create")}
            >
              <View className="h-24 items-center justify-center bg-blue-100">
                <MaterialIcons name="person-add" size={28} color="#3B82F6" />
              </View>
              <View className="">
                <Text
                  className="text-blue-500 text-center font-medium"
                  numberOfLines={1}
                >
                  Thêm mới
                </Text>
                <View className="flex-row items-center justify-center mt-1">
                  <Text className="text-blue-400 text-xs">Tài khoản con</Text>
                </View>
              </View>
            </Pressable>

            {/* Sub Accounts - Improved Cards */}
            {childs?.map((account) => (
              <Pressable
                key={account.id}
                className="w-24 mr-3"
                onPress={() =>
                  router.push({
                    pathname: "/sub-accounts/[id]",
                    params: { id: account.id },
                  })
                }
              >
                <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <Image
                    source={{
                      uri: account.userDetail.avatarUrl,
                    }}
                    className="w-24 h-24 rounded-t-xl"
                    resizeMode="cover"
                  />
                  <View className="p-2">
                    <Text
                      className="font-medium text-center text-sm"
                      numberOfLines={1}
                    >
                      {account.userDetail.firstName}
                    </Text>
                    <View className="flex-row items-center justify-center mt-1">
                      <MaterialIcons name="cake" size={12} color="#6B7280" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {new Date().getFullYear() -
                          new Date(account.userDetail.dob).getFullYear()}{" "}
                        tuổi
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items - Redesigned */}
        <View className="px-5 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Quản lý tài khoản
          </Text>
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {MENU_ITEMS.slice(0, 4).map((item, index) => (
              <Pressable
                key={item.id}
                className={`flex-row items-center py-4 px-4 ${
                  index !== 0 ? "border-t border-gray-100" : ""
                }`}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  className={`w-10 h-10 rounded-full bg-blue-50 items-center justify-center`}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={22}
                    color="#3B82F6"
                  />
                </View>
                <Text className="flex-1 font-medium ml-3 text-gray-700">
                  {item.title}
                </Text>
                {item.badge && (
                  <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                    <Text className="text-blue-600 text-xs font-medium">
                      {childs?.length}
                    </Text>
                  </View>
                )}
                <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>

          <Text className="text-xl font-bold text-gray-800 mt-8 mb-4">
            Tùy chọn khác
          </Text>
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {MENU_ITEMS.slice(4).map((item, index) => (
              <Pressable
                key={item.id}
                className={`flex-row items-center py-4 px-4 ${
                  index !== 0 ? "border-t border-gray-100" : ""
                }`}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  className={`w-10 h-10 rounded-full bg-${
                    item.id === "notifications"
                      ? "amber"
                      : item.id === "settings"
                      ? "gray"
                      : item.id === "products"
                      ? "blue"
                      : "green"
                  }-50 items-center justify-center`}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={22}
                    color={
                      item.id === "notifications"
                        ? "#F59E0B"
                        : item.id === "settings"
                        ? "#4B5563"
                        : item.id === "products"
                        ? "#3B82F6"
                        : "#10B981"
                    }
                  />
                </View>
                <Text className="flex-1 font-medium ml-3 text-gray-700">
                  {item.title}
                </Text>
                {item.badge && (
                  <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                    <Text className="text-blue-600 text-xs font-medium">
                      {childs?.length}
                    </Text>
                  </View>
                )}
                <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
              </Pressable>
            ))}

            {/* Logout Button - Redesigned */}
            <Pressable
              className="flex-row items-center py-4 px-4 border-t border-gray-100"
              onPress={handleLogout}
              disabled={isProcessing}
            >
              <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center">
                <MaterialIcons
                  name="logout"
                  size={22}
                  color={isProcessing ? "#9CA3AF" : "#EF4444"}
                />
              </View>
              <Text
                className={
                  isProcessing
                    ? "flex-1 font-medium ml-3 text-gray-400"
                    : "flex-1 font-medium ml-3 text-red-500"
                }
              >
                Đăng xuất
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
