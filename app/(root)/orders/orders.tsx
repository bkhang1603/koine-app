import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_ORDERS } from "@/constants/mock-data";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useOrder } from "@/queries/useOrder";
import { GetAllOrderResType, orderRes } from "@/schema/order-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";

const STATUS_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "processing", label: "Đang xử lý" },
] as const;

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return {
        bg: "bg-green-100",
        text: "text-green-600",
        label: "Đã hoàn thành",
      };
    case "PROCESSING":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "Đang xử lý",
      };
    case "DONE":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "Đang xử lý",
      };
    case "CANCEL":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        label: "Đã huỷ",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Không xác định",
      };
  }
};

export default function OrdersScreen() {
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "completed" | "processing"
  >("all");

  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error,
  } = useOrder({
    page_size: 10,
    page_index: 1,
    token,
  });

  let orders: GetAllOrderResType["data"] = [];

  if (ordersData && !ordersError) {
    if (ordersData.data.length === 0) {
    } else {
      const parsedResult = orderRes.safeParse(ordersData);
      if (parsedResult.success) {
        orders = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (ordersLoading) return <ActivityIndicatorScreen />;
  if (ordersError) return <ErrorScreen message="Failed to load orders." />;

  const filteredOrders = orders;

  // const filteredOrders = MOCK_ORDERS.filter(
  //     (order) => selectedStatus === "all" || order.status === selectedStatus
  // );

  if (orders.length == 0) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack title="Đơn hàng của tôi" returnTab={"/(tabs)/profile/profile"} showMoreOptions={false}/>
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="receipt-long" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Bạn chưa có lịch sử giao dịch
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-bold">Mua ngay!</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <HeaderWithBack title="Đơn hàng của tôi" returnTab={"/(tabs)/profile/profile"} showMoreOptions={false}/>

      <ScrollView>
        {/* Status Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {STATUS_FILTERS.map((filter) => (
            <Pressable
              key={filter.id}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedStatus === filter.id ? "bg-blue-500" : "bg-gray-100"
              }`}
              onPress={() => setSelectedStatus(filter.id)}
            >
              <Text
                className={
                  selectedStatus === filter.id
                    ? "text-white font-medium"
                    : "text-gray-600"
                }
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Orders List */}
        <View className="p-4">
          {filteredOrders.map((order) => {
            const status = getStatusColor(order.status);
            return (
              <View
                key={order.id}
                className="bg-white rounded-2xl mb-4 border border-gray-100 p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-bold text-base">{order.status}</Text>
                    <Text className="text-gray-500 mt-1">
                      Ngày đặt:{" "}
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                  <View className={`${status.bg} px-3 py-1 rounded-full`}>
                    <Text className={status.text}>{status.label}</Text>
                  </View>
                </View>

                <View className="mt-4 space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">
                      Phương thức thanh toán
                    </Text>
                    <Text className="font-medium">Mã QR</Text>
                    {/* <Text className="font-medium">{order.}</Text> */}
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Tổng tiền</Text>
                    <Text className="font-bold text-blue-500">
                      {order.totalAmount.toLocaleString("vi-VN")} ₫
                    </Text>
                  </View>
                </View>

                <Pressable
                  className="mt-4 flex-row items-center justify-center py-3 bg-gray-100 rounded-xl"
                  onPress={() =>
                    router.push({
                      pathname: "/orders/[id]",
                      params: { id: order.id },
                    })
                  }
                >
                  <MaterialIcons name="receipt" size={20} color="#374151" />
                  <Text className="ml-2 font-medium text-gray-700">
                    Xem chi tiết
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
