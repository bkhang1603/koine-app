import React from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";

const ACHIEVEMENTS = [
    {
        id: "1",
        title: "Người học chăm chỉ",
        description: "Hoàn thành 5 khóa học",
        icon: "school",
        progress: 3,
        total: 5,
        color: "#3B82F6",
    },
    {
        id: "2",
        title: "Thành tích xuất sắc",
        description: "Đạt điểm tuyệt đối trong 3 bài kiểm tra",
        icon: "emoji-events",
        progress: 2,
        total: 3,
        color: "#F59E0B",
    },
    {
        id: "3",
        title: "Người học năng động",
        description: "Học tập 7 ngày liên tiếp",
        icon: "local-fire-department",
        progress: 5,
        total: 7,
        color: "#EF4444",
    },
    {
        id: "4",
        title: "Người chia sẻ tích cực",
        description: "Chia sẻ 10 chứng chỉ lên mạng xã hội",
        icon: "share",
        progress: 4,
        total: 10,
        color: "#10B981",
    },
];

export default function AchievementsScreen() {
    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Thành tích" />

            <ScrollView>
                <View className="p-4">
                    {/* Stats Overview */}
                    <View className="flex-row justify-between bg-blue-50 p-4 rounded-2xl mb-6">
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-blue-500">
                                12
                            </Text>
                            <Text className="text-gray-600">
                                Tổng thành tích
                            </Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-blue-500">
                                5
                            </Text>
                            <Text className="text-gray-600">Đã đạt được</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-blue-500">
                                7
                            </Text>
                            <Text className="text-gray-600">
                                Đang thực hiện
                            </Text>
                        </View>
                    </View>

                    {/* Achievements List */}
                    {ACHIEVEMENTS.map((achievement) => (
                        <View
                            key={achievement.id}
                            className="bg-white rounded-2xl mb-4 border border-gray-100 p-4"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <View className="flex-row items-start">
                                <View
                                    className="w-12 h-12 rounded-xl items-center justify-center"
                                    style={{
                                        backgroundColor: `${achievement.color}15`,
                                    }}
                                >
                                    <MaterialIcons
                                        name={achievement.icon as any}
                                        size={24}
                                        color={achievement.color}
                                    />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="font-bold text-base">
                                        {achievement.title}
                                    </Text>
                                    <Text className="text-gray-600 mt-1">
                                        {achievement.description}
                                    </Text>
                                </View>
                            </View>

                            <View className="mt-4">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-600">
                                        Tiến độ
                                    </Text>
                                    <Text className="font-medium">
                                        {achievement.progress}/
                                        {achievement.total}
                                    </Text>
                                </View>
                                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${
                                                (achievement.progress /
                                                    achievement.total) *
                                                100
                                            }%`,
                                            backgroundColor: achievement.color,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
