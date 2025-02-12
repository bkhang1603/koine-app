import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "course":
            return "menu-book";
        case "achievement":
            return "emoji-events";
        default:
            return "notifications";
    }
};

export default function NotificationsScreen() {
    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Thông báo" />

            <ScrollView>
                <View className="p-4">
                    {MOCK_NOTIFICATIONS.map((notification) => (
                        <Pressable
                            key={notification.id}
                            className={`flex-row items-start p-4 mb-2 rounded-xl ${
                                notification.read ? "bg-white" : "bg-blue-50"
                            }`}
                        >
                            <View
                                className={`w-10 h-10 rounded-full items-center justify-center ${
                                    notification.read
                                        ? "bg-gray-100"
                                        : "bg-blue-100"
                                }`}
                            >
                                <MaterialIcons
                                    name={getNotificationIcon(notification.type)}
                                    size={20}
                                    color={
                                        notification.read
                                            ? "#6B7280"
                                            : "#3B82F6"
                                    }
                                />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text
                                    className={`font-bold ${
                                        notification.read
                                            ? "text-gray-900"
                                            : "text-blue-900"
                                    }`}
                                >
                                    {notification.title}
                                </Text>
                                <Text
                                    className={
                                        notification.read
                                            ? "text-gray-600"
                                            : "text-blue-800"
                                    }
                                >
                                    {notification.message}
                                </Text>
                                <Text className="text-gray-500 text-sm mt-1">
                                    {notification.time}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
} 