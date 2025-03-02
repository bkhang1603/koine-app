import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_USER, MOCK_COURSES } from "@/constants/mock-data";
//cái này cũng cân nhắc bỏ
const STATUS_FILTERS = [
    { id: "all", label: "Tất cả" },
    { id: "in-progress", label: "Đang học" },
    { id: "completed", label: "Đã hoàn thành" },
] as const;

export default function MyCoursesScreen() {
    const [selectedStatus, setSelectedStatus] = useState<"all" | "in-progress" | "completed">("all");

    const purchasedCourses = MOCK_COURSES.filter(course => 
        MOCK_USER.purchasedCourses.includes(course.id)
    );

    const filteredCourses = purchasedCourses.filter(course => {
        if (selectedStatus === "all") return true;
        if (selectedStatus === "completed") return (course.progress || 0) === 100;
        return (course.progress || 0) < 100;
    });

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Khóa học đã mua" returnTab={"/(tabs)/profile/profile"}/>
            
            {/* Status Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4 py-3 border-b border-gray-100"
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

            <ScrollView className="flex-1">
                {/* Course List */}
                <View className="p-4">
                    {filteredCourses.map((course) => (
                        <Pressable
                            key={course.id}
                            className="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                            onPress={() =>
                                router.push({
                                    pathname: "/learn/[courseId]/lessons/[lessonId]",
                                    params: {
                                        courseId: course.id,
                                        lessonId: course.chapters[0].lessons[0].id,
                                    },
                                } as any)
                            }
                        >
                            <Image
                                source={{ uri: course.thumbnail }}
                                className="w-full h-48 rounded-t-xl"
                            />
                            <View className="p-4">
                                <Text className="font-bold text-lg mb-2">
                                    {course.title}
                                </Text>
                                <View className="flex-row items-center mb-3">
                                    <MaterialIcons
                                        name="schedule"
                                        size={16}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-600 ml-1">
                                        {course.duration}
                                    </Text>
                                    <Text className="text-gray-400 mx-2">•</Text>
                                    <MaterialIcons
                                        name="bar-chart"
                                        size={16}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-600 ml-1">
                                        {course.level}
                                    </Text>
                                </View>

                                {/* Progress Bar */}
                                <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <View
                                        className="bg-blue-500 h-full rounded-full"
                                        style={{
                                            width: `${course.progress || 0}%`,
                                        }}
                                    />
                                </View>
                                <View className="flex-row items-center justify-between mt-2">
                                    <Text className="text-gray-600">
                                        Tiến độ: {course.progress || 0}%
                                    </Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-blue-500 font-medium mr-1">
                                            Tiếp tục học
                                        </Text>
                                        <MaterialIcons
                                            name="chevron-right"
                                            size={20}
                                            color="#3B82F6"
                                        />
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Empty State */}
                {filteredCourses.length === 0 && (
                    <View className="p-4 items-center justify-center">
                        <MaterialIcons
                            name="school"
                            size={48}
                            color="#9CA3AF"
                        />
                        <Text className="text-gray-500 mt-2 text-center">
                            {selectedStatus === "all"
                                ? "Bạn chưa mua khóa học nào"
                                : selectedStatus === "completed"
                                ? "Chưa có khóa học nào hoàn thành"
                                : "Không có khóa học đang học"}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
} 