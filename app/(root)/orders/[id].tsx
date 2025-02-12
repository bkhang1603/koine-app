import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_ORDERS } from "@/constants/mock-data";

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const order = MOCK_ORDERS.find((o) => o.id === id);

    if (!order) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return {
                    bg: "bg-green-50",
                    text: "text-green-600",
                    label: "Đã hoàn thành",
                    icon: "check-circle",
                };
            case "processing":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-600",
                    label: "Đang xử lý",
                    icon: "hourglass-empty",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-600",
                    label: "Chưa xác định",
                    icon: "info",
                };
        }
    };

    const status = getStatusColor(order.status);

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Chi tiết đơn hàng" showMoreOptions={false} />
            <ScrollView>
                {/* Order Info */}
                <View className="p-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold">
                            Đơn hàng #{order.id}
                        </Text>
                        <View
                            className={`${status.bg} px-3 py-1 rounded-full flex-row items-center`}
                        >
                            <MaterialIcons
                                name={status.icon as any}
                                size={16}
                                color={status.text.replace("text-", "")}
                            />
                            <Text className={`${status.text} ml-1`}>
                                {status.label}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-gray-600 mt-1">{order.date}</Text>
                </View>

                {/* Course Info */}
                <View className="p-4 border-b border-gray-100">
                    <Text className="font-bold mb-3">Thông tin khóa học</Text>
                    <Text className="text-lg">{order.courseTitle}</Text>
                </View>

                {/* Payment Info */}
                <View className="p-4 border-b border-gray-100">
                    <Text className="font-bold mb-3">Thông tin thanh toán</Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Phương thức</Text>
                            <Text>{order.paymentMethod}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Giá khóa học</Text>
                            <Text>{order.price.toLocaleString("vi-VN")} ₫</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Giảm giá</Text>
                            <Text>0 ₫</Text>
                        </View>
                        <View className="pt-2 border-t border-gray-100 mt-2">
                            <View className="flex-row justify-between">
                                <Text className="font-bold">Tổng cộng</Text>
                                <Text className="font-bold text-blue-500">
                                    {order.price.toLocaleString("vi-VN")} ₫
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
                        <Text className="text-blue-500 ml-2">
                            support@example.com
                        </Text>
                    </View>
                    <View className="flex-row items-center mt-2">
                        <MaterialIcons name="phone" size={20} color="#6B7280" />
                        <Text className="text-blue-500 ml-2">1900 xxxx</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
} 