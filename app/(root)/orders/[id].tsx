import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import {
  useOrderDetails,
  useDeleteOrderMutation,
  useRePurchaseOrder,
} from "@/queries/useOrder";
import { useAppStore } from "@/components/app-provider";
import { orderDetailsRes } from "@/schema/order-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { useUpdatePaymentMethod } from "@/queries/useOrder";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const {
    data: orderDetailsData,
    isLoading: orderDetailsLoading,
    isError: orderDetailsError,
  } = useOrderDetails({
    orderId: id as string,
    token,
  });

  const deleteOrderMutation = useDeleteOrderMutation();
  const rePurchaseOrder = useRePurchaseOrder();
  const updatePaymentMethodMutation = useUpdatePaymentMethod();

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

  // Check if order has any physical products
  const hasPhysicalProducts = React.useMemo(() => {
    if (!orderDetails) return false;
    return orderDetails.orderDetails.some((detail) => detail.product !== null);
  }, [orderDetails]);

  // Initialize selected payment method from order data
  React.useEffect(() => {
    if (
      orderDetails &&
      orderDetails.payment.payMethod &&
      selectedPayment === ""
    ) {
      setSelectedPayment(orderDetails.payment.payMethod);
    }
  }, [orderDetails, selectedPayment]);

  if (orderDetailsLoading) return <ActivityIndicatorScreen />;
  if (orderDetailsError)
    return console.log("Lấy chi tiết đơn hàng lỗi, thử lại sau");

  if (orderDetails == null)
    return console.log(
      "Lấy chi tiết đơn hàng lỗi. Chi tiết đơn hàng không tồn tại"
    );

  const order = orderDetails;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Chờ xử lý",
          icon: "info",
          icon_color: "gray",
        };
      case "DELIVERING":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          label: "Đang giao",
          icon: "local-shipping",
          icon_color: "blue",
        };
      case "DELIVERED":
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Đã giao",
          icon: "local-shipping",
          icon_color: "gray",
        };
      case "FAILED_PAYMENT":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          label: "Thanh toán thất bại",
          icon_color: "red",
        };
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          label: "Đã hoàn thành",
          icon: "check-circle",
          icon_color: "green",
        };
      case "FAILED":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          label: "Thất bại",
          icon: "remove-circle",
          icon_color: "red",
        };
      case "CANCELLED":
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Đã hủy",
          icon: "cancel",
          icon_color: "gray",
        };
      case "PROCESSING":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          label: "Đang xử lý",
          icon: "hourglass-empty",
          icon_color: "blue",
        };
      case "REFUND_REQUEST":
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Yêu cầu hoàn tiền",
          icon: "question-answer",
          icon_color: "gray",
        };
      case "REFUNDING":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          label: "Đang trả tiền",
          icon: "hourglass-empty",
          icon_color: "blue",
        };
      case "REFUNDED":
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: "price-check",
          label: "Đã trả tiền",
          icon_color: "gray",
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Không xác định",
          icon: "info",
          icon_color: "gray",
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

  const handleRePurchase = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);

      const res = await rePurchaseOrder.mutateAsync({
        orderId: id as string,
        token,
      });

      if (res) {
        // Chuyển hướng đến trang thanh toán với URL được mã hóa
        const encodedUrl = encodeURIComponent(res.data);
        router.push(`/(root)/cart/payment-screen?paymentUrl=${encodedUrl}`);
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán lại đơn hàng:", error);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const handlePaymentMethodChange = async (method: string) => {
    if (order.status.toLowerCase() !== "processing") return;

    Alert.alert(
      "Xác nhận thay đổi",
      "Bạn có chắc chắn muốn thay đổi phương thức thanh toán?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              await updatePaymentMethodMutation.mutateAsync({
                orderId: id as string,
                body: { payMethod: method },
                token,
              });
              setSelectedPayment(method);
              Alert.alert(
                "Thông báo",
                "Thay đổi phương thức thanh toán thành công",
                [{ text: "Đóng", style: "default" }]
              );
            } catch (error) {
              console.error("Error updating payment method:", error);
              Alert.alert("Lỗi", "Không thể thay đổi phương thức thanh toán", [
                { text: "Đóng", style: "default" },
              ]);
            }
          },
        },
      ]
    );
  };

  const renderActionButtons = () => {
    // Only show buttons for processing status
    if (order.totalAmount == 0)
      return (
        <View className="p-4 flex-row space-x-4">
          <Pressable
            className="flex-1 bg-gray-500 py-3 rounded-xl items-center"
            disabled={true}
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
    if (order.status.toLowerCase() === "processing") {
      return (
        <View className="p-4 flex-row space-x-4">
          <Pressable
            className={`flex-1 ${
              isProcessing ? "bg-gray-500" : "bg-blue-500"
            } py-3 rounded-xl items-center`}
            onPress={handleRePurchase}
            disabled={isProcessing}
          >
            <Text className="text-white font-medium">
              {isProcessing ? "Đang xử lý..." : "Thanh toán"}
            </Text>
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

  const renderPaymentSection = () => {
    const isProcessingStatus = order.status.toLowerCase() === "processing";

    return (
      <View className="p-4 border-b border-gray-100">
        <View className="flex items-start mb-4">
          <View className="flex-row items-center">
            <MaterialIcons name="credit-card" size={20} color="#3B82F6" />
            <Text className="text-xl font-bold ml-2">
              Phương thức thanh toán
            </Text>
          </View>

          {isProcessingStatus && (
            <Text className="text-blue-500 text-sm">Có thể thay đổi</Text>
          )}
        </View>

        {/* Payment Method Options */}
        <View className="bg-gray-50 rounded-xl p-4">
          {/* If not in processing status, show current payment method only */}
          {!isProcessingStatus ? (
            <View className="flex-row items-center p-2 bg-white rounded-lg">
              <MaterialIcons
                name={
                  order.payment.payMethod === "COD"
                    ? "local-shipping"
                    : "account-balance"
                }
                size={24}
                color="#4B5563"
              />
              <Text className="ml-3 text-gray-800 font-medium">
                {order.payment.payMethod === "COD"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Chuyển khoản ngân hàng (BANKING)"}
              </Text>
            </View>
          ) : (
            // If in processing status, show selectable options
            <View className="space-y-3">
              {/* Banking Option */}
              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg ${
                  selectedPayment === "BANKING"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-white"
                }`}
                onPress={() => handlePaymentMethodChange("BANKING")}
                disabled={orderDetails.payment.payMethod == "BANKING"}
                activeOpacity={0.7}
              >
                <View className="w-6 h-6 rounded-full border-2 border-blue-500 justify-center items-center mr-3">
                  {selectedPayment === "BANKING" && (
                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Chuyển khoản ngân hàng
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Thanh toán qua chuyển khoản hoặc mã QR
                  </Text>
                </View>
                <MaterialIcons
                  name="account-balance"
                  size={24}
                  color="#4B5563"
                />
              </TouchableOpacity>

              {/* COD Option - only if there are physical products */}
              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg ${
                  !hasPhysicalProducts ? "opacity-50" : ""
                } ${
                  selectedPayment === "COD"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-white"
                }`}
                onPress={() =>
                  hasPhysicalProducts ? handlePaymentMethodChange("COD") : null
                }
                activeOpacity={0.7}
                disabled={!hasPhysicalProducts}
              >
                <View className="w-6 h-6 rounded-full border-2 border-blue-500 justify-center items-center mr-3">
                  {selectedPayment === "COD" && (
                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Thanh toán khi nhận hàng
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {hasPhysicalProducts
                      ? "Thanh toán khi nhận được hàng"
                      : "Chỉ áp dụng cho đơn hàng có sản phẩm vật lý"}
                  </Text>
                </View>
                <MaterialIcons
                  name="local-shipping"
                  size={24}
                  color="#4B5563"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderDeliveryInfo = () => {
    if (!hasPhysicalProducts) return null;

    return (
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="local-shipping" size={20} color="#3B82F6" />
          <Text className="text-xl font-bold ml-2">Thông tin giao hàng</Text>
        </View>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <MaterialIcons name="person" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Người nhận:</Text>
            <Text className="ml-2">{order.deliveryInfo?.name}</Text>
          </View>

          <View className="flex-row items-start">
            <MaterialIcons name="location-on" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Địa chỉ:</Text>
            <Text className="ml-2 flex-1">{order.deliveryInfo?.address}</Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons name="phone" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Số điện thoại:</Text>
            <Text className="ml-2">{order.deliveryInfo?.phone}</Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons name="local-shipping" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Trạng thái:</Text>
            <Text className="ml-2">
              {order.deliveryInfo?.status === "PENDING"
                ? "Đang chờ xử lý"
                : order.deliveryInfo?.status === "INTRANSIT"
                ? "Đang giao hàng"
                : order.deliveryInfo?.status === "DELIVERED"
                ? "Đã giao hàng"
                : order.deliveryInfo?.status === "FAILED"
                ? "Thất bại"
                : order.deliveryInfo?.status == "RETURNED"
                ? "Trả hàng"
                : "Không xác định"}
            </Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons name="local-shipping" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Tốc độ:</Text>
            <Text className="ml-2">
              {order.deliMethod === "STANDARD"
                ? "Tiêu chuẩn"
                : order.deliveryInfo?.status === "EXPEDITED"
                ? "Hỏa tốc"
                : "Không xác định"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderOrderDetails = () => {
    const courses = order.orderDetails.filter(
      (detail) => detail.course !== null
    );
    const products = order.orderDetails.filter(
      (detail) => detail.product !== null
    );

    const OrderItem = ({
      image,
      title,
      description,
      quantity,
      price,
      discount,
      totalPrice,
      stockQuantity,
    }: {
      image: string;
      title: string;
      description: string;
      quantity: number;
      price: number;
      discount: number;
      totalPrice: number;
      stockQuantity?: number;
    }) => (
      <View className="bg-white rounded-xl border border-gray-100 mb-3 overflow-hidden">
        <View className="p-4">
          <View className="flex-row">
            <Image source={{ uri: image }} className="w-24 h-24 rounded-lg" />
            <View className="flex-1 ml-4">
              <Text className="text-base font-semibold" numberOfLines={2}>
                {title}
              </Text>

              <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
                {description}
              </Text>

              {stockQuantity !== undefined && (
                <Text className="text-gray-500 text-sm mt-1">
                  Còn lại: {stockQuantity} sản phẩm
                </Text>
              )}
            </View>
          </View>

          <View className="mt-3 pt-3 border-t border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-gray-500">Số lượng:</Text>
                <Text className="font-medium ml-2">{quantity}</Text>
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-500">
                  {(price * (1 - discount)).toLocaleString("vi-VN")} ₫
                </Text>
              </View>
            </View>

            <View className="mt-2 flex-row justify-end">
              <Text className="text-gray-500 text-base">
                Thành tiền:{" "}
                <Text className="font-medium text-blue-500">
                  {totalPrice.toLocaleString("vi-VN")} ₫
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );

    return (
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="shopping-cart" size={20} color="#3B82F6" />
          <Text className="text-xl font-bold ml-2">Chi tiết đơn hàng</Text>
        </View>

        {/* Courses Section */}
        {courses.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="school" size={20} color="#3B82F6" />
              <Text className="text-blue-500 font-semibold ml-2">
                Khóa học ({courses.length})
              </Text>
            </View>

            {courses.map((detail) => (
              <OrderItem
                key={detail.id}
                image={detail.course?.imageUrl || ""}
                title={detail.course?.title || ""}
                description={detail.course?.description || ""}
                quantity={detail.quantity}
                price={detail.unitPrice}
                discount={detail.discount || 0}
                totalPrice={detail.totalPrice}
              />
            ))}
          </View>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <View>
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="shopping-bag" size={20} color="#3B82F6" />
              <Text className="text-blue-500 font-semibold ml-2">
                Sản phẩm ({products.length})
              </Text>
            </View>

            {products.map((detail) => (
              <OrderItem
                key={detail.id}
                image={detail.product?.imageUrl || ""}
                title={detail.product?.name || ""}
                description={detail.product?.description || ""}
                quantity={detail.quantity}
                price={detail.unitPrice}
                discount={detail.discount || 0}
                totalPrice={detail.totalPrice}
                stockQuantity={detail.product?.stockQuantity}
              />
            ))}
          </View>
        )}

        {courses.length === 0 && products.length === 0 && (
          <View className="py-8 items-center">
            <MaterialIcons name="shopping-cart" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">
              Không có sản phẩm nào trong đơn hàng
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderPaymentInfo = () => {
    // Tính tổng giá trị khóa học và sản phẩm riêng biệt
    const courseTotal = order.orderDetails
      .filter((detail) => detail.course !== null)
      .reduce((sum, detail) => sum + detail.totalPrice, 0);

    const productTotal = order.orderDetails
      .filter((detail) => detail.product !== null)
      .reduce((sum, detail) => sum + detail.totalPrice, 0);

    return (
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="payment" size={20} color="#3B82F6" />
          <Text className="text-xl font-bold ml-2">Thông tin thanh toán</Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-4">
          {/* Chi tiết giá */}
          {courseTotal > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tổng khóa học</Text>
              <Text>{courseTotal.toLocaleString("vi-VN")} ₫</Text>
            </View>
          )}

          {productTotal > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tổng sản phẩm</Text>
              <Text>{productTotal.toLocaleString("vi-VN")} ₫</Text>
            </View>
          )}

          {/* Phí vận chuyển - chỉ hiện khi có sản phẩm vật lý */}
          {hasPhysicalProducts && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Phí vận chuyển</Text>
              <Text>{order.deliAmount.toLocaleString("vi-VN")} ₫</Text>
            </View>
          )}

          {/* Tổng cộng */}
          <View className="mt-3 pt-3 border-t border-gray-200">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-600 text-sm mb-1">
                  Tổng thanh toán
                </Text>
                <Text className="text-xs text-gray-500">
                  (Đã bao gồm VAT nếu có)
                </Text>
              </View>
              <Text className="text-xl font-bold text-blue-500">
                {order.totalAmount.toLocaleString("vi-VN")} ₫
              </Text>
            </View>
          </View>

          {/* Ghi chú thanh toán */}
          {selectedPayment === "BANKING" && (
            <View className="mt-4 p-3 bg-blue-50 rounded-lg">
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="info" size={16} color="#3B82F6" />
                <Text className="text-blue-600 font-medium ml-2">
                  Hướng dẫn thanh toán
                </Text>
              </View>
              <Text className="text-blue-600 text-sm">
                Vui lòng quét mã QR hoặc chuyển khoản theo thông tin được cung
                cấp sau khi xác nhận đơn hàng
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSupport = () => {
    return (
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="help" size={20} color="#3B82F6" />
          <Text className="text-xl font-bold ml-2">Hỗ trợ</Text>
        </View>
        <Text className="text-gray-600">
          Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua:
        </Text>
        <View className="flex-row items-center mt-2">
          <MaterialIcons name="email" size={20} color="#6B7280" />
          <Text className="text-blue-500 ml-2">support@example.com</Text>
        </View>
        <View className="flex-row items-center mt-2">
          <MaterialIcons name="phone" size={20} color="#6B7280" />
          <Text className="text-blue-500 ml-2">0934 600 600 - Khang</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Chi tiết đơn hàng"
        returnTab={"/(root)/orders/orders"}
        showMoreOptions={false}
      />
      <ScrollView>
        {/* Order Info */}
        <View className="p-4 border-b border-gray-100">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="receipt" size={20} color="#3B82F6" />
            <Text className="text-xl font-bold ml-2">
              Đơn hàng #{order.orderCode}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="font-semibold mr-2">Trạng thái</Text>
            <View
              className={`${status.bg} self-start py-1 px-2 rounded-xl flex-row items-center`}
            >
              <MaterialIcons
                name={status.icon as any}
                size={16}
                color={status.icon_color}
              />
              <Text className={`${status.text} ml-1 pr-1`}>{status.label}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="font-semibold mr-2">Ngày đặt hàng:</Text>
            <Text className="text-gray-600">
              {new Date(order.orderDate).toLocaleDateString("vi-VN")}
            </Text>
            <Text className="ml-2 italic text-gray-600">(ngày/tháng/năm)</Text>
          </View>
        </View>

        {renderPaymentSection()}
        {renderDeliveryInfo()}
        {renderOrderDetails()}
        {renderPaymentInfo()}
        {renderSupport()}
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
