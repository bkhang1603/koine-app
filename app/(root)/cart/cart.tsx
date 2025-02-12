import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_CART_ITEMS } from "@/constants/mock-data";

export default function CartScreen() {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [items, setItems] = useState(MOCK_CART_ITEMS);

    const isAllSelected = selectedItems.length === items.length;
    const total = items
        .filter((item) => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0);

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map((item) => item.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const deleteSelected = () => {
        setItems(items.filter((item) => !selectedItems.includes(item.id)));
        setSelectedItems([]);
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        setItems(items.map((item) =>
            item.id === id ? { ...item, quantity } : item
        ));
    };

    if (items.length === 0) {
        return (
            <View className="flex-1 bg-white">
                <HeaderWithBack title="Giỏ hàng" showMoreOptions={false} />
                <View className="flex-1 items-center justify-center p-4">
                    <MaterialIcons
                        name="shopping-cart"
                        size={64}
                        color="#9CA3AF"
                    />
                    <Text className="text-gray-500 text-lg mt-4 text-center">
                        Giỏ hàng của bạn đang trống
                    </Text>
                    <Pressable
                        className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                        onPress={() => router.push("/(tabs)")}
                    >
                        <Text className="text-white font-bold">
                            Tiếp tục mua sắm
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Giỏ hàng" showMoreOptions={false} />
            
            {/* Actions */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <Pressable
                    className="flex-row items-center"
                    onPress={toggleSelectAll}
                >
                    <MaterialIcons
                        name={isAllSelected ? "check-box" : "check-box-outline-blank"}
                        size={24}
                        color={isAllSelected ? "#3B82F6" : "#9CA3AF"}
                    />
                    <Text className="ml-2">Chọn tất cả</Text>
                </Pressable>
                {selectedItems.length > 0 && (
                    <Pressable
                        className="flex-row items-center"
                        onPress={deleteSelected}
                    >
                        <MaterialIcons name="delete" size={24} color="#EF4444" />
                        <Text className="ml-2 text-red-500">
                            Xóa đã chọn ({selectedItems.length})
                        </Text>
                    </Pressable>
                )}
            </View>

            <ScrollView>
                {items.map((item) => (
                    <View
                        key={item.id}
                        className="flex-row items-center p-4 border-b border-gray-100"
                    >
                        <Pressable
                            onPress={() => toggleSelectItem(item.id)}
                            hitSlop={8}
                        >
                            <MaterialIcons
                                name={
                                    selectedItems.includes(item.id)
                                        ? "check-box"
                                        : "check-box-outline-blank"
                                }
                                size={24}
                                color={
                                    selectedItems.includes(item.id)
                                        ? "#3B82F6"
                                        : "#9CA3AF"
                                }
                            />
                        </Pressable>
                        <Image
                            source={{ uri: item.thumbnail }}
                            className="w-24 h-24 rounded-xl ml-3"
                        />
                        <View className="flex-1 ml-3">
                            <Text className="font-bold" numberOfLines={2}>
                                {item.title}
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <MaterialIcons
                                    name="schedule"
                                    size={16}
                                    color="#6B7280"
                                />
                                <Text className="text-gray-600 ml-1">
                                    {item.duration}
                                </Text>
                            </View>
                            <View className="flex-row items-center mt-3">
                                <Pressable
                                    className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
                                    onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <MaterialIcons
                                        name="remove"
                                        size={20}
                                        color={item.quantity <= 1 ? "#9CA3AF" : "#374151"}
                                    />
                                </Pressable>
                                <Text className="mx-4 font-medium">{item.quantity}</Text>
                                <Pressable
                                    className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
                                    onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                    <MaterialIcons name="add" size={20} color="#374151" />
                                </Pressable>
                            </View>
                            <Text className="text-blue-500 font-bold mt-2">
                                {item.price.toLocaleString("vi-VN")} ₫
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <View className="flex-row justify-between mb-4">
                    <View>
                        <Text className="text-gray-600">
                            Đã chọn: {selectedItems.length}
                        </Text>
                        <Text className="text-gray-600">
                            Tổng tiền:
                            <Text className="text-blue-500 font-bold">
                                {" "}
                                {total.toLocaleString("vi-VN")} ₫
                            </Text>
                        </Text>
                    </View>
                    <Pressable
                        className={`px-6 py-3 rounded-xl ${
                            selectedItems.length > 0
                                ? "bg-blue-500"
                                : "bg-gray-300"
                        }`}
                        onPress={() => {
                            if (selectedItems.length > 0) {
                                router.push("/cart/checkout");
                            }
                        }}
                        disabled={selectedItems.length === 0}
                    >
                        <Text
                            className={`font-bold ${
                                selectedItems.length > 0
                                    ? "text-white"
                                    : "text-gray-500"
                            }`}
                        >
                            Thanh toán
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
