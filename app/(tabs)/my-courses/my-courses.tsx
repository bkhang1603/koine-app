import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_MY_COURSES } from "@/constants/mock-data";

export default function MyCoursesScreen() {
    return (
        <ScrollView className="flex-1 bg-white">
            <SafeAreaView>
                <View className="p-4">
                    <Text className="text-2xl font-bold">Khóa học của tôi</Text>
                    <Text className="text-gray-600 mt-1">
                        Tiếp tục học tập nào!
                    </Text>
                </View>

                <View className="px-4">
                    {MOCK_MY_COURSES.map((course) => (
                        <Pressable
                            key={course.id}
                            className="bg-white rounded-2xl mb-4 p-4 border border-gray-100"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                            onPress={() =>
                                router.push({
                                    pathname: "/learn/[courseId]" as any,
                                    params: { courseId: course.id },
                                })
                            }
                        >
                            <View className="flex-row">
                                <Image
                                    source={{ uri: course.thumbnail }}
                                    className="w-20 h-20 rounded-xl"
                                />
                                <View className="flex-1 ml-3">
                                    <Text
                                        className="font-bold"
                                        numberOfLines={2}
                                    >
                                        {course.title}
                                    </Text>
                                    {/* Progress Bar */}
                                    <View className="mt-2">
                                        <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <View
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{
                                                    width: `${
                                                        course.progress || 0
                                                    }%`,
                                                }}
                                            />
                                        </View>
                                        <Text className="text-gray-500 text-xs mt-1">
                                            {course.progress || 0}% hoàn thành
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="mt-3 border-t border-gray-100 pt-3">
                                <Text className="text-gray-500 text-sm">
                                    Bài học tiếp theo
                                </Text>
                                <View className="flex-row items-center mt-1">
                                    <MaterialIcons
                                        name="play-circle-fill"
                                        size={16}
                                        color="#3B82F6"
                                    />
                                    <Text className="text-gray-700 ml-2">
                                        {course.chapters[0].lessons.find(
                                            (l) =>
                                                l.id ===
                                                course.lastLearnedLessonId
                                        )?.title ||
                                            course.chapters[0].lessons[0].title}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}
