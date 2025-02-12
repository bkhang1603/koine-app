import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_ORDERS } from "@/constants/mock-data";
import HeaderWithBack from "@/components/HeaderWithBack";

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
        case "processing":
            return {
                bg: "bg-blue-100",
                text: "text-blue-600",
                label: "Đang xử lý",
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

    const filteredOrders = MOCK_ORDERS.filter(
        (order) => selectedStatus === "all" || order.status === selectedStatus
    );

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <HeaderWithBack title="Đơn hàng của tôi" />

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
                                selectedStatus === filter.id
                                    ? "bg-blue-500"
                                    : "bg-gray-100"
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
                                        <Text className="font-bold text-base">
                                            {order.courseTitle}
                                        </Text>
                                        <Text className="text-gray-500 mt-1">
                                            Ngày đặt: {order.date}
                                        </Text>
                                    </View>
                                    <View
                                        className={`${status.bg} px-3 py-1 rounded-full`}
                                    >
                                        <Text className={status.text}>
                                            {status.label}
                                        </Text>
                                    </View>
                                </View>

                                <View className="mt-4 space-y-2">
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">
                                            Phương thức thanh toán
                                        </Text>
                                        <Text className="font-medium">
                                            {order.paymentMethod}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">
                                            Tổng tiền
                                        </Text>
                                        <Text className="font-bold text-blue-500">
                                            {order.price.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            ₫
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
                                    <MaterialIcons
                                        name="receipt"
                                        size={20}
                                        color="#374151"
                                    />
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
