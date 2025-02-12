import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/child/HeaderWithBack";
import { SafeAreaView } from "react-native-safe-area-context";

const NOTIFICATIONS = [
    {
        id: "1",
        title: "Chúc mừng bạn! 🎉",
        message: "Bạn đã hoàn thành khóa học Kỹ năng giao tiếp",
        type: "achievement",
        time: "2 giờ trước",
        read: false,
        points: 100,
    },
    {
        id: "2",
        title: "Nhiệm vụ hàng ngày 🎯",
        message: "Bạn đã hoàn thành 3/5 nhiệm vụ hôm nay. Cố lên nào!",
        type: "daily",
        time: "5 giờ trước",
        read: true,
    },
    {
        id: "3",
        title: "Khóa học mới! 📚",
        message: "Khám phá khóa học mới về Quản lý cảm xúc ngay nào",
        type: "course",
        time: "1 ngày trước",
        read: true,
    },
    {
        id: "4",
        title: "Streak 5 ngày! 🔥",
        message: "Bạn đã học liên tục 5 ngày. Tuyệt vời lắm!",
        type: "streak",
        time: "2 ngày trước",
        read: true,
        streakDays: 5,
    },
];

export default function NotificationsScreen() {
    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Thông báo" />

            <ScrollView>
                <View className="p-4">
                    {NOTIFICATIONS.map((notification) => (
                        <Pressable
                            key={notification.id}
                            className={`mb-4 rounded-2xl overflow-hidden border border-gray-200 ${
                                notification.read ? "opacity-70" : ""
                            }`}
                        >
                            {/* Header với màu nền tương ứng */}
                            <View
                                className={`p-3 ${
                                    notification.type === "achievement"
                                        ? "bg-yellow-500"
                                        : notification.type === "daily"
                                        ? "bg-green-500"
                                        : notification.type === "streak"
                                        ? "bg-orange-500"
                                        : "bg-violet-500"
                                }`}
                            >
                                <Text className="text-white font-bold">
                                    {notification.title}
                                </Text>
                                <Text className="text-white/80 text-sm">
                                    {notification.time}
                                </Text>
                            </View>

                            {/* Content */}
                            <View className="p-4 bg-white">
                                <View className="flex-row items-start">
                                    <View
                                        className={`w-12 h-12 rounded-xl items-center justify-center ${
                                            notification.type === "achievement"
                                                ? "bg-yellow-100"
                                                : notification.type === "daily"
                                                ? "bg-green-100"
                                                : notification.type === "streak"
                                                ? "bg-orange-100"
                                                : "bg-violet-100"
                                        }`}
                                    >
                                        <MaterialIcons
                                            name={
                                                notification.type ===
                                                "achievement"
                                                    ? "emoji-events"
                                                    : notification.type ===
                                                      "daily"
                                                    ? "today"
                                                    : notification.type ===
                                                      "streak"
                                                    ? "local-fire-department"
                                                    : "school"
                                            }
                                            size={28}
                                            color={
                                                notification.type ===
                                                "achievement"
                                                    ? "#F59E0B"
                                                    : notification.type ===
                                                      "daily"
                                                    ? "#10B981"
                                                    : notification.type ===
                                                      "streak"
                                                    ? "#F97316"
                                                    : "#7C3AED"
                                            }
                                        />
                                    </View>
                                    <View className="flex-1 ml-3">
                                        <Text className="text-gray-600 text-base leading-5">
                                            {notification.message}
                                        </Text>
                                        {notification.points && (
                                            <View className="flex-row items-center mt-2">
                                                <MaterialIcons
                                                    name="stars"
                                                    size={16}
                                                    color="#F59E0B"
                                                />
                                                <Text className="text-yellow-500 font-medium ml-1">
                                                    +{notification.points} điểm
                                                </Text>
                                            </View>
                                        )}
                                        {notification.streakDays && (
                                            <View className="flex-row items-center mt-2">
                                                <MaterialIcons
                                                    name="local-fire-department"
                                                    size={16}
                                                    color="#F97316"
                                                />
                                                <Text className="text-orange-500 font-medium ml-1">
                                                    {notification.streakDays}{" "}
                                                    ngày liên tiếp
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
