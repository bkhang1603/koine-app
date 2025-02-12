import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_CART_ITEMS } from "@/constants/mock-data";

export default function CheckoutScreen() {
    const total = MOCK_CART_ITEMS.reduce((sum, item) => sum + item.price, 0);
    const [showQR, setShowQR] = useState(false);

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Thanh toán" showMoreOptions={false} />
            <ScrollView>
                {/* Order Summary */}
                <View className="p-4 border-b border-gray-100">
                    <Text className="font-bold text-lg mb-3">
                        Thông tin đơn hàng
                    </Text>
                    {MOCK_CART_ITEMS.map((item) => (
                        <View
                            key={item.id}
                            className="flex-row items-center mb-3"
                        >
                            <Image
                                source={{ uri: item.thumbnail }}
                                className="w-16 h-16 rounded-lg"
                            />
                            <View className="flex-1 ml-3">
                                <Text className="font-medium" numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text className="text-blue-500">
                                    {item.price.toLocaleString("vi-VN")} ₫
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Payment Method */}
                <View className="p-4">
                    <Text className="font-bold text-lg mb-3">
                        Phương thức thanh toán
                    </Text>
                    <Pressable
                        className="border border-gray-200 rounded-xl p-4 flex-row items-center"
                        onPress={() => setShowQR(true)}
                    >
                        <MaterialIcons name="qr-code" size={24} color="#374151" />
                        <View className="ml-3 flex-1">
                            <Text className="font-medium">
                                Chuyển khoản qua QR
                            </Text>
                            <Text className="text-gray-500">
                                Quét mã QR để thanh toán
                            </Text>
                        </View>
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color="#9CA3AF"
                        />
                    </Pressable>

                    {showQR && (
                        <View className="mt-4 items-center">
                            <Image
                                source={{ uri: "https://example.com/qr-code.png" }}
                                className="w-64 h-64"
                            />
                            <Text className="text-center mt-4 text-gray-600">
                                Quét mã QR để thanh toán số tiền:{"\n"}
                                <Text className="font-bold text-blue-500">
                                    {total.toLocaleString("vi-VN")} ₫
                                </Text>
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-600">Tổng thanh toán</Text>
                    <Text className="font-bold text-lg">
                        {total.toLocaleString("vi-VN")} ₫
                    </Text>
                </View>
                <Pressable
                    className="bg-blue-500 p-4 rounded-xl items-center"
                    onPress={() => router.push("/cart/success")}
                >
                    <Text className="text-white font-bold">
                        Xác nhận đã thanh toán
                    </Text>
                </Pressable>
            </View>
        </View>
    );
} 