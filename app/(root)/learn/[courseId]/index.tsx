import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_MY_COURSES } from "@/constants/mock-data";

export default function CourseLearnScreen() {
    const { courseId } = useLocalSearchParams<{ courseId: string }>();
    const course = MOCK_MY_COURSES.find((c) => c.id === courseId);

    if (!course) return null;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title={course.title} />
            <ScrollView>
                {/* Course Progress */}
                <View className="p-4">
                    <Text className="text-lg font-bold">Tiến độ học tập</Text>
                    <View className="mt-2">
                        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                    width: `${course.progress || 0}%`,
                                }}
                            />
                        </View>
                        <Text className="text-gray-500 text-sm mt-1">
                            {course.progress || 0}% hoàn thành
                        </Text>
                    </View>
                </View>

                {/* Chapters and Lessons */}
                <View className="px-4">
                    {course.chapters.map((chapter, chapterIndex) => (
                        <View
                            key={chapter.id}
                            className="mb-6 bg-white rounded-xl border border-gray-100"
                        >
                            <View className="p-4 border-b border-gray-100">
                                <Text className="font-bold text-lg">
                                    {chapter.title}
                                </Text>
                                <Text className="text-gray-600 mt-1">
                                    {chapter.description}
                                </Text>
                                <View className="flex-row items-center mt-2">
                                    <MaterialIcons
                                        name="schedule"
                                        size={16}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-600 ml-1">
                                        {chapter.duration}
                                    </Text>
                                </View>
                            </View>

                            <View className="p-4">
                                {chapter.lessons.map((lesson, lessonIndex) => (
                                    <Pressable
                                        key={lesson.id}
                                        className="flex-row items-center py-3"
                                        onPress={() =>
                                            router.push({
                                                pathname:
                                                    "/learn/[courseId]/lessons/[lessonId]" as any,
                                                params: {
                                                    courseId: course.id,
                                                    lessonId: lesson.id,
                                                },
                                            })
                                        }
                                    >
                                        {lesson.completed ? (
                                            <MaterialIcons
                                                name="check-circle"
                                                size={24}
                                                color="#10B981"
                                            />
                                        ) : lesson.id ===
                                          course.lastLearnedLessonId ? (
                                            <MaterialIcons
                                                name="play-circle-fill"
                                                size={24}
                                                color="#3B82F6"
                                            />
                                        ) : (
                                            <View className="w-6 h-6 rounded-full border-2 border-gray-300 items-center justify-center">
                                                <Text className="text-gray-500 text-xs">
                                                    {lessonIndex + 1}
                                                </Text>
                                            </View>
                                        )}
                                        <View className="ml-3 flex-1">
                                            <Text
                                                className={`${
                                                    lesson.completed
                                                        ? "text-gray-500"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {lesson.title}
                                            </Text>
                                            <View className="flex-row items-center mt-1">
                                                <MaterialIcons
                                                    name={
                                                        lesson.type === "video"
                                                            ? "videocam"
                                                            : "article"
                                                    }
                                                    size={14}
                                                    color="#6B7280"
                                                />
                                                <Text className="text-gray-500 text-sm ml-1">
                                                    {lesson.duration}
                                                </Text>
                                            </View>
                                        </View>
                                        <MaterialIcons
                                            name="chevron-right"
                                            size={24}
                                            color="#9CA3AF"
                                        />
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
