import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function Header() {
    return (
        <View className="flex-row items-center justify-between px-4 py-2">
            <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-blue-500">Teen</Text>
                <Text className="text-2xl font-bold text-gray-700">Care</Text>
            </View>

            <View className="flex-row items-center gap-4">
                <Link href="/notifications/notifications" asChild>
                    <Pressable className="relative">
                        <MaterialIcons
                            name="notifications"
                            size={28}
                            color="#374151"
                        />
                        <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                3
                            </Text>
                        </View>
                    </Pressable>
                </Link>

                <Link href="/cart/cart" asChild>
                    <Pressable className="relative">
                        <MaterialIcons
                            name="shopping-cart"
                            size={28}
                            color="#374151"
                        />
                        <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                2
                            </Text>
                        </View>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}
