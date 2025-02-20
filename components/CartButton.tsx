import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppStore } from "./app-provider";

export default function CartButton() {
    const cart = useAppStore((state) => state.cart);
    const itemCount = cart ? cart?.cartDetails.length : 0

    return (
        <Pressable
            onPress={() => router.push("/(root)/cart/cart")}
            // onPress={() => router.push("/(root)/cart/payment-screen")}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            hitSlop={8}
        >
            <MaterialIcons name="shopping-cart" size={24} color="#374151" />
            {itemCount > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                        {itemCount}
                    </Text>
                </View>
            )}
        </Pressable>
    );
} 