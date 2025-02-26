import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_USER, MOCK_COURSES } from "@/constants/mock-data";

const OVERVIEW_STATS = [
    {
        id: "total_time",
        label: "Tổng thời gian học",
        value: "43 giờ",
        icon: "schedule",
        color: "blue",
    },
    {
        id: "avg_progress",
        label: "Tiến độ trung bình",
        value: "67%",
        icon: "trending-up",
        color: "green",
    },
    {
        id: "completed",
        label: "Hoàn thành",
        value: "8 khóa học",
        icon: "check-circle",
        color: "purple",
    },
];

export default function LearningManagementScreen() {
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Quản lý học tập" returnTab={"/(tabs)/profile/profile"}/>
            <ScrollView>
                {/* Account Selection */}
                <View className="p-4">
                    <Text className="text-lg font-bold mb-3">Chọn tài khoản</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        {MOCK_USER.subAccounts.map((account) => {
                            const activeCourses = MOCK_COURSES.filter(course => 
                                account.activeCourses.includes(course.id)
                            );
                            const avgProgress = Math.round(
                                activeCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / 
                                (activeCourses.length || 1)
                            );
                            
                            return (
                                <Pressable
                                    key={account.id}
                                    className={`w-1/2 p-2`}
                                    onPress={() => setSelectedAccount(account.id)}
                                >
                                    <View
                                        className={`p-4 rounded-xl border ${
                                            selectedAccount === account.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 bg-white"
                                        }`}
                                        style={{
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 4,
                                            elevation: 3,
                                        }}
                                    >
                                        <View className="flex-row items-center mb-3">
                                            <Image
                                                source={{ uri: account.avatar }}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <View className="ml-3 flex-1">
                                                <Text className="font-bold">{account.name}</Text>
                                                <Text className="text-gray-600 text-sm">
                                                    {2024 - account.birthYear} tuổi
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-gray-600 text-sm">
                                                    Đang học
                                                </Text>
                                                <Text className="font-bold">
                                                    {activeCourses.length} khóa học
                                                </Text>
                                            </View>
                                            <View>
                                                <Text className="text-gray-600 text-sm">
                                                    Tiến độ
                                                </Text>
                                                <Text className="font-bold text-blue-500">
                                                    {avgProgress}%
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {selectedAccount && (
                    <>
                        {/* Overview Stats */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-4 py-3"
                        >
                            {OVERVIEW_STATS.map((stat) => (
                                <View
                                    key={stat.id}
                                    className={`bg-${stat.color}-50 rounded-xl p-4 mr-3`}
                                    style={{ minWidth: 150 }}
                                >
                                    <View
                                        className={`w-10 h-10 bg-${stat.color}-100 rounded-full items-center justify-center mb-2`}
                                    >
                                        <MaterialIcons
                                            name={stat.icon as any}
                                            size={24}
                                            color={`#${
                                                stat.color === "blue"
                                                    ? "3B82F6"
                                                    : stat.color === "green"
                                                    ? "059669"
                                                    : "9333EA"
                                            }`}
                                        />
                                    </View>
                                    <Text className="text-2xl font-bold">
                                        {stat.value}
                                    </Text>
                                    <Text className="text-gray-600">
                                        {stat.label}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Learning Progress */}
                        <View className="p-4">
                            <Text className="text-lg font-bold mb-4">
                                Tiến độ học tập
                            </Text>
                            {MOCK_COURSES.filter((course) =>
                                MOCK_USER.subAccounts
                                    .find((acc) => acc.id === selectedAccount)
                                    ?.activeCourses.includes(course.id)
                            ).map((course) => (
                                <Pressable
                                    key={course.id}
                                    className="bg-white rounded-xl border border-gray-100 p-4 mb-4"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/learning-management/course-progress/[id]",
                                            params: {
                                                id: course.id,
                                                accountId: selectedAccount,
                                            },
                                        })
                                    }
                                >
                                    <View className="flex-row items-center mb-3">
                                        <Image
                                            source={{ uri: course.thumbnail }}
                                            className="w-16 h-16 rounded-lg"
                                        />
                                        <View className="ml-3 flex-1">
                                            <Text
                                                className="font-bold"
                                                numberOfLines={2}
                                            >
                                                {course.title}
                                            </Text>
                                            <View className="flex-row items-center mt-1">
                                                <MaterialIcons
                                                    name="schedule"
                                                    size={16}
                                                    color="#6B7280"
                                                />
                                                <Text className="text-gray-600 ml-1">
                                                    {course.duration}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Progress Section */}
                                    <View className="bg-gray-50 p-3 rounded-lg">
                                        <View className="flex-row justify-between mb-2">
                                            <Text className="text-gray-600">
                                                Tiến độ
                                            </Text>
                                            <Text className="font-medium">
                                                {course.progress || 0}%
                                            </Text>
                                        </View>
                                        <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <View
                                                className="bg-blue-500 h-full rounded-full"
                                                style={{
                                                    width: `${
                                                        course.progress || 0
                                                    }%`,
                                                }}
                                            />
                                        </View>
                                        <View className="flex-row justify-between mt-2">
                                            <Text className="text-gray-500 text-sm">
                                                Hoàn thành:{" "}
                                                {course.chapters.reduce(
                                                    (sum, chapter) =>
                                                        sum +
                                                        chapter.lessons.filter(
                                                            (l) => l.completed
                                                        ).length,
                                                    0
                                                )}{" "}
                                                /{" "}
                                                {course.chapters.reduce(
                                                    (sum, chapter) =>
                                                        sum +
                                                        chapter.lessons.length,
                                                    0
                                                )}{" "}
                                                bài học
                                            </Text>
                                            <Text className="text-blue-500 text-sm font-medium">
                                                Chi tiết
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </>
                )}

                {!selectedAccount && (
                    <View className="p-4 items-center justify-center">
                        <MaterialIcons
                            name="person"
                            size={48}
                            color="#9CA3AF"
                        />
                        <Text className="text-gray-500 mt-2 text-center">
                            Chọn tài khoản để xem tiến độ học tập
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
} 