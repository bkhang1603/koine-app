import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_COURSES, MOCK_USER } from "@/constants/mock-data";

export default function CourseProgressScreen() {
    const { id, accountId } = useLocalSearchParams<{
        id: string;
        accountId: string;
    }>();

    const course = MOCK_COURSES.find((c) => c.id === id);
    const account = MOCK_USER.subAccounts.find((acc) => acc.id === accountId);

    if (!course || !account) return null;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Chi tiết tiến độ" />
            <ScrollView>
                {/* Course Info */}
                <View className="p-4 border-b border-gray-100">
                    <Text className="text-xl font-bold">{course.title}</Text>
                    <Text className="text-gray-600 mt-1">
                        Học viên: {account.name}
                    </Text>
                </View>

                {/* Overall Progress */}
                <View className="p-4 bg-blue-50">
                    <Text className="text-lg font-bold mb-3">Tổng quan</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Tiến độ tổng thể</Text>
                        <Text className="font-bold">{course.progress || 0}%</Text>
                    </View>
                    <View className="bg-white h-2 rounded-full overflow-hidden">
                        <View
                            className="bg-blue-500 h-full rounded-full"
                            style={{
                                width: `${course.progress || 0}%`,
                            }}
                        />
                    </View>
                    <View className="flex-row mt-4">
                        <View className="flex-1">
                            <Text className="text-gray-600">Đã học</Text>
                            <Text className="font-bold text-lg">
                                {course.chapters.reduce(
                                    (sum, chapter) =>
                                        sum +
                                        chapter.lessons.filter((l) => l.completed)
                                            .length,
                                    0
                                )}{" "}
                                bài
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-600">Còn lại</Text>
                            <Text className="font-bold text-lg">
                                {course.chapters.reduce(
                                    (sum, chapter) =>
                                        sum +
                                        chapter.lessons.filter((l) => !l.completed)
                                            .length,
                                    0
                                )}{" "}
                                bài
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-600">Thời gian học</Text>
                            <Text className="font-bold text-lg">
                                {course.duration}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Chapters Progress */}
                <View className="p-4">
                    <Text className="text-lg font-bold mb-4">
                        Tiến độ theo chương
                    </Text>
                    {course.chapters.map((chapter, index) => {
                        const completedLessons = chapter.lessons.filter(
                            (l) => l.completed
                        ).length;
                        const progress = Math.round(
                            (completedLessons / chapter.lessons.length) * 100
                        );

                        return (
                            <View
                                key={chapter.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 mb-4"
                            >
                                <Text className="font-bold">
                                    Chương {index + 1}: {chapter.title}
                                </Text>
                                <Text className="text-gray-600 mt-1">
                                    {chapter.description}
                                </Text>

                                {/* Chapter Progress */}
                                <View className="mt-3">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-gray-600">
                                            Tiến độ
                                        </Text>
                                        <Text className="font-medium">
                                            {progress}%
                                        </Text>
                                    </View>
                                    <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <View
                                            className="bg-blue-500 h-full rounded-full"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Lessons List */}
                                <View className="mt-3">
                                    {chapter.lessons.map((lesson) => (
                                        <View
                                            key={lesson.id}
                                            className="flex-row items-center py-2 border-t border-gray-100"
                                        >
                                            <MaterialIcons
                                                name={
                                                    lesson.completed
                                                        ? "check-circle"
                                                        : "radio-button-unchecked"
                                                }
                                                size={20}
                                                color={
                                                    lesson.completed
                                                        ? "#059669"
                                                        : "#9CA3AF"
                                                }
                                            />
                                            <View className="ml-3 flex-1">
                                                <Text
                                                    className={`${
                                                        lesson.completed
                                                            ? "text-gray-600"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {lesson.title}
                                                </Text>
                                                <View className="flex-row items-center mt-1">
                                                    <MaterialIcons
                                                        name={
                                                            lesson.type === "video"
                                                                ? "play-circle-outline"
                                                                : "article"
                                                        }
                                                        size={16}
                                                        color="#6B7280"
                                                    />
                                                    <Text className="text-gray-500 text-sm ml-1">
                                                        {lesson.duration}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
} 