import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
  { id: "COMPLETED", label: "Đã hoàn thành" },
  { id: "PROCESSING", label: "Đang xử lý" },
  { id: "CANCELLED", label: "Đã hủy" },
  { id: "PENDING", label: "Chờ xử lý" },
  { id: "DELIVERING", label: "Giao hàng" },
  { id: "DELIVERED", label: "Đã giao" },
  { id: "FAILED_PAYMENT", label: "Thanh toán thất bại" },
  { id: "REFUND_REQUEST", label: "Yêu cầu hoàn tiền" },
  { id: "REFUNDING", label: "Đang trả tiền" },
  { id: "REFUNDED", label: "Đã trả tiền" },
  { id: "FAILED", label: "Thất bại" },
] as const;

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Chờ xử lý",
      };
    case "DELIVERING":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "Đang giao",
      };
    case "DELIVERED":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Đã giao",
      };
    case "FAILED_PAYMENT":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        label: "Thanh toán thất bại",
      };
    case "COMPLETED":
      return {
        bg: "bg-green-100",
        text: "text-green-600",
        label: "Đã hoàn thành",
      };
    case "FAILED":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        label: "Thất bại",
      };
    case "CANCELLED":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Đã hủy",
      };
    case "PROCESSING":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "Đang xử lý",
      };
    case "REFUND_REQUEST":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Yêu cầu hoàn tiền",
      };
    case "REFUNDING":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "Đang trả tiền",
      };
    case "REFUNDED":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Đã trả tiền",
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
  const { message } = useLocalSearchParams<{ message: string }>();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    | "all"
    | "COMPLETED"
    | "PROCESSING"
    | "CANCELLED"
    | "PENDING"
    | "DELIVERING"
    | "DELIVERED"
    | "FAILED_PAYMENT"
    | "REFUND_REQUEST"
    | "REFUNDING"
    | "REFUNDED"
    | "FAILED"
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

  let orders: GetAllOrderResType["data"]["orders"] = [];

  useEffect(() => {
    if (message && message.length != 0 && message == "true") {
      setModalMessage("Thanh toán thành công!");
      setShowModal(true);
      const timeout = setTimeout(() => {
        setShowModal(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  if (ordersData && !ordersError) {
    if (ordersData.data.orders.length > 0) {
      // Bổ sung giá trị mặc định nếu thiếu
      ordersData.data.orders = ordersData.data.orders.map((order) => ({
        ...order,
        deliveryInfo: order.deliveryInfo ?? null, // Nếu thiếu, đặt thành null
      }));

      const parsedResult = orderRes.safeParse(ordersData);
      if (parsedResult.success) {
        orders = parsedResult.data.data.orders;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (ordersLoading) return <ActivityIndicatorScreen />;
  if (ordersError) return <ErrorScreen message="Failed to load orders." />;

  // const filteredOrders = orders;

  if (orders.length == 0) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title="Đơn hàng của tôi"
          returnTab={"/(tabs)/profile/profile"}
          showMoreOptions={false}
        />
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

  const filteredOrders = orders.filter(
    (order) => selectedStatus === "all" || order.status === selectedStatus
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <HeaderWithBack
        title="Đơn hàng của tôi"
        returnTab={"/(tabs)/profile/profile"}
        showMoreOptions={false}
      />

      <ScrollView>
        {showModal && (
          <View className="absolute top-8 left-5 right-5 border-2 border-black bg-gray-100 p-4 rounded-xl shadow-lg z-50">
            <Text className="text-green-800 text-center font-medium">
              {/* {modalMessage} */}
              Thanh toán thành công!
            </Text>
          </View>
        )}

        {/* Status Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
          contentContainerStyle={{ paddingRight: 20 }}
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
                <Text className="font-semibold text-lg">
                  Mã đơn: {order.orderCode}
                </Text>

                <View className="flex-row justify-between items-center mt-1">
                  <View className="flex-1">
                    <Text className="text-gray-600">
                      Ngày đặt:{" "}
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                  <View className={`${status.bg} px-3 py-1 rounded-full`}>
                    <Text className={status.text}>{status.label}</Text>
                  </View>
                </View>

                <View className="mt-1 space-y-2">
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
