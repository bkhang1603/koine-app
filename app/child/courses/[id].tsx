import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { MOCK_COURSES } from "@/constants/mock-data";
import HeaderWithBack from "@/components/child/HeaderWithBack";

export default function CourseDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const course = MOCK_COURSES.find(c => c.id === id);

    if (!course) return null;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Chi tiết khóa học" />
            <ScrollView>
                <View className="p-4">
                    <Text className="text-2xl font-bold">{course.title}</Text>
                    <Text className="text-gray-600 mt-2">{course.description}</Text>

                    {/* Progress Overview */}
                    <View className="mt-6 bg-violet-50 p-4 rounded-xl">
                        <Text className="font-bold mb-2">Tiến độ học tập</Text>
                        <View className="bg-white h-2 rounded-full overflow-hidden">
                            <View 
                                className="bg-violet-500 h-full rounded-full"
                                style={{ width: `${course.progress || 0}%` }}
                            />
                        </View>
                        <Text className="text-gray-600 mt-2">
                            Đã hoàn thành {course.progress || 0}%
                        </Text>
                    </View>

                    {/* Chapters */}
                    <View className="mt-6">
                        <Text className="font-bold text-lg mb-4">Nội dung khóa học</Text>
                        {course.chapters.map((chapter, index) => (
                            <View key={chapter.id} className="mb-4">
                                <Text className="font-bold">
                                    Chương {index + 1}: {chapter.title}
                                </Text>
                                {chapter.lessons.map((lesson) => (
                                    <Pressable
                                        key={lesson.id}
                                        className="flex-row items-center py-3 border-b border-gray-100"
                                        onPress={() => router.push({
                                            pathname: "/child/courses/[courseId]/lessons/[lessonId]",
                                            params: { courseId: course.id, lessonId: lesson.id }
                                        })}
                                    >
                                        <MaterialIcons 
                                            name={lesson.completed ? "check-circle" : "play-circle-outline"}
                                            size={24}
                                            color={lesson.completed ? "#10B981" : "#7C3AED"}
                                        />
                                        <View className="ml-3 flex-1">
                                            <Text>{lesson.title}</Text>
                                            <Text className="text-gray-600 text-sm">
                                                {lesson.duration}
                                            </Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
} 