import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_ORDERS } from "@/constants/mock-data";
import { useOrderDetails, useDeleteOrderMutation } from "@/queries/useOrder";
import { useAppStore } from "@/components/app-provider";
import { GetOrderDetailsResType, orderDetailsRes } from "@/schema/order-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    data: orderDetailsData,
    isLoading: orderDetailsLoading,
    isError: orderDetailsError,
  } = useOrderDetails({
    orderId: id as string,
    token,
  });

  const deleteOrderMutation = useDeleteOrderMutation();

  // Move this logic into a useMemo hook to prevent re-renders
  const orderDetails = React.useMemo(() => {
    if (!orderDetailsData || orderDetailsError) {
      return null;
    }

    if (orderDetailsData.data === null) {
      return null;
    }

    const parsedResult = orderDetailsRes.safeParse(orderDetailsData);
    if (parsedResult.success) {
      return parsedResult.data.data;
    }

    console.error("Validation errors:", parsedResult.error.errors);
    return null;
  }, [orderDetailsData, orderDetailsError]);

  if (orderDetailsLoading) return <ActivityIndicatorScreen />;
  if (orderDetailsError)
    return (
      <ErrorScreen message="Failed to load orderDetailss. Showing default orderDetailss." />
    );

  if (orderDetails == null)
    return (
      <ErrorScreen message="Failed to load orderDetailss. Course is null." />
    );

  const order = orderDetails;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          label: "Đã hoàn thành",
          icon: "check-circle",
        };
      case "PROCESSING":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          label: "Đang xử lý",
          icon: "hourglass-empty",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Chưa xác định",
          icon: "info",
        };
    }
  };

  const status = getStatusColor(order.status);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    if (isCancelling) return;

    setIsCancelling(true);

    try {
      await deleteOrderMutation.mutateAsync({
        orderId: id as string,
        body: {
          deletedNote: cancelReason,
        },
        token,
      });

      setShowCancelModal(false);
      setCancelReason("");
      setCancelError("");

      router.back();
    } catch (error) {
      console.error("Error cancelling order:", error);
      setCancelError("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log("Proceeding to checkout");
  };

  const renderActionButtons = () => {
    // Only show buttons for processing status
    if (order.status.toLowerCase() === "processing") {
      return (
        <View className="p-4 flex-row space-x-4">
          <Pressable
            className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
            onPress={handleCheckout}
          >
            <Text className="text-white font-medium">Thanh toán</Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-red-500 py-3 rounded-xl items-center"
            onPress={() => setShowCancelModal(true)}
          >
            <Text className="text-white font-medium">Hủy đơn</Text>
          </Pressable>
        </View>
      );
    } else if (order.status.toLowerCase() === "completed") {
      return (
        <View className="p-4">
          <View className="bg-gray-100 py-3 rounded-xl items-center">
            <Text className="text-gray-500 font-medium">
              Đơn hàng đã hoàn thành
            </Text>
          </View>
        </View>
      );
    } else if (
      order.status.toLowerCase() === "cancelled" ||
      order.status.toLowerCase() === "canceled"
    ) {
      return (
        <View className="p-4">
          <View className="bg-gray-100 py-3 rounded-xl items-center">
            <Text className="text-gray-500 font-medium">
              Đơn hàng đã bị hủy
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack title="Chi tiết đơn hàng" returnTab={"/(root)/orders/orders"} showMoreOptions={false} />
      <ScrollView>
        {/* Order Info */}
        <View className="p-4 border-b border-gray-100">
          <View className="flex justify-between">
            <Text className="text-lg font-bold">Đơn hàng #{order.id}</Text>
            <View
              className={`${status.bg} self-start py-1 px-2 rounded-xl flex-row items-center`}
            >
              <MaterialIcons
                name={status.icon as any}
                size={16}
                color={status.text.replace("text-", "")}
              />
              <Text className={`${status.text} ml-1 pr-1`}>{status.label}</Text>
            </View>
            <Text className="text-gray-600 mt-1">{order.orderDate}</Text>
          </View>
        </View>

        {/* Course Info */}
        <View className="p-4 border-b border-gray-100">
          <Text className="font-bold mb-3">Thông tin khóa học</Text>
          <Text className="text-lg">
            {new Date(order.orderDate).toLocaleDateString("vi-VN")}
          </Text>
        </View>

        {/* Payment Info */}
        <View className="p-4 border-b border-gray-100">
          <Text className="font-bold mb-3">Thông tin thanh toán</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Phương thức</Text>
              <Text>Mã QR</Text>
              {/* <Text>{order.paymentMethod}</Text> */}
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Giá khóa học</Text>
              <Text>{order.totalAmount.toLocaleString("vi-VN")} ₫</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Giảm giá</Text>
              <Text>0 ₫</Text>
            </View>
            <View className="pt-2 border-t border-gray-100 mt-2">
              <View className="flex-row justify-between">
                <Text className="font-bold">Tổng cộng</Text>
                <Text className="font-bold text-blue-500">
                  {order.totalAmount.toLocaleString("vi-VN")} ₫
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support */}
        <View className="p-4">
          <Text className="font-bold mb-3">Hỗ trợ</Text>
          <Text className="text-gray-600">
            Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua:
          </Text>
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="email" size={20} color="#6B7280" />
            <Text className="text-blue-500 ml-2">support@example.com</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="phone" size={20} color="#6B7280" />
            <Text className="text-blue-500 ml-2">1900 xxxx</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {renderActionButtons()}

      {/* Cancel Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCancelModal}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-[90%] max-w-md">
            <Text className="text-xl font-bold mb-4">
              Xác nhận hủy đơn hàng
            </Text>

            <Text className="text-gray-600 mb-4">
              Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này
            </Text>

            <TextInput
              className={`border h-32 rounded-xl p-3 mb-2 ${
                cancelError ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Nhập lý do hủy đơn hàng"
              multiline
              textAlignVertical="top"
              numberOfLines={6}
              value={cancelReason}
              onChangeText={(text) => {
                setCancelReason(text);
                setCancelError("");
              }}
            />

            {cancelError ? (
              <Text className="text-red-500 mb-2">{cancelError}</Text>
            ) : null}

            <View className="flex-row space-x-3 mt-4">
              <Pressable
                className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                onPress={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setCancelError("");
                }}
              >
                <Text className="text-gray-700 font-medium">Đóng</Text>
              </Pressable>

              <Pressable
                className={`flex-1 ${
                  isCancelling ? "bg-red-300" : "bg-red-500"
                } py-3 rounded-xl items-center`}
                onPress={handleCancel}
                disabled={isCancelling}
              >
                <Text className="text-white font-medium">
                  {isCancelling ? "Đang xử lý..." : "Xác nhận hủy"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
