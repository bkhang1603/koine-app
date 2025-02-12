import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_CHILD } from "@/constants/mock-data";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChildMyCoursesScreen() {
    return (
        <View className="flex-1 bg-white">
            {/* Top SafeArea với background trắng */}
            <View className="bg-white">
                <SafeAreaView edges={["top"]} className="bg-white" />
            </View>

            {/* Header */}
            <View className="p-4">
                <Text className="text-2xl font-bold">Khóa học của tôi</Text>
                <Text className="text-gray-600 mt-1">
                    Tiếp tục học tập nào!
                </Text>
            </View>

            {/* Course List */}
            <ScrollView className="flex-1">
                <View className="p-4">
                    {MOCK_CHILD.activeCourses.map((course) => (
                        <Pressable
                            key={course.id}
                            className="bg-white rounded-2xl border border-gray-100 mb-4 shadow-sm overflow-hidden"
                            onPress={() =>
                                router.push({
                                    pathname: "/child/courses/[id]",
                                    params: { id: course.id },
                                })
                            }
                        >
                            {/* Course Thumbnail */}
                            <Image
                                source={{ uri: course.thumbnail }}
                                className="w-full h-40"
                                resizeMode="cover"
                            />

                            {/* Course Info */}
                            <View className="p-4">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="font-bold text-lg">
                                            {course.title}
                                        </Text>
                                        <Text className="text-gray-600 mt-1">
                                            {course.description}
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Stats */}
                                <View className="flex-row justify-between mt-4 bg-violet-50 p-3 rounded-xl">
                                    <View className="items-center flex-1">
                                        <Text className="text-violet-600 text-lg font-bold">
                                            {course.completedLessons}
                                        </Text>
                                        <Text className="text-violet-600 text-sm">
                                            Đã học
                                        </Text>
                                    </View>
                                    <View className="items-center flex-1 border-x border-violet-100">
                                        <Text className="text-violet-600 text-lg font-bold">
                                            {course.totalLessons}
                                        </Text>
                                        <Text className="text-violet-600 text-sm">
                                            Bài học
                                        </Text>
                                    </View>
                                    <View className="items-center flex-1">
                                        <Text className="text-violet-600 text-lg font-bold">
                                            {course.progress}%
                                        </Text>
                                        <Text className="text-violet-600 text-sm">
                                            Hoàn thành
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="mt-4">
                                    <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <View
                                            className={`h-full rounded-full ${
                                                course.progress === 100
                                                    ? "bg-green-500"
                                                    : "bg-violet-500"
                                            }`}
                                            style={{
                                                width: `${course.progress}%`,
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Next Lesson */}
                                <View className="mt-4 flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <MaterialIcons
                                            name="play-circle-fill"
                                            size={24}
                                            color="#7C3AED"
                                        />
                                        <View className="ml-3 flex-1">
                                            <Text className="text-sm text-gray-600">
                                                Bài học tiếp theo
                                            </Text>
                                            <Text className="font-medium">
                                                {course.lastLesson.title}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-violet-600">
                                        {course.lastLesson.duration}
                                    </Text>
                                </View>

                                {/* Continue Button */}
                                <Pressable
                                    className="bg-violet-500 p-3 rounded-xl mt-4 flex-row items-center justify-center"
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/child/courses/[courseId]/lessons/[lessonId]",
                                            params: {
                                                courseId: course.id,
                                                lessonId: course.lastLesson.id,
                                            },
                                        })
                                    }
                                >
                                    <Text className="text-white font-bold">
                                        Tiếp tục học
                                    </Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom SafeArea với background trắng */}
            <SafeAreaView edges={["bottom"]} className="bg-white" />
        </View>
    );
}
