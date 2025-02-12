import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MY_COURSES = [
    {
        id: "1",
        title: "Hiểu về cơ thể trong giai đoạn dậy thì",
        description: "Khám phá những thay đổi của cơ thể và cách ứng phó tích cực",
        thumbnail: "https://example.com/puberty.jpg",
        progress: 75,
        lastLesson: {
            title: "Những thay đổi về tâm sinh lý",
            chapter: "Chương 2: Thay đổi tâm lý",
            duration: "15 phút",
        },
    },
    {
        id: "2",
        title: "Kỹ năng giao tiếp cho tuổi teen",
        description: "Xây dựng mối quan hệ lành mạnh và tự tin giao tiếp",
        thumbnail: "https://example.com/communication.jpg",
        progress: 30,
        lastLesson: {
            title: "Kỹ năng lắng nghe tích cực",
            chapter: "Chương 1: Các kỹ năng cơ bản",
            duration: "20 phút",
        },
    },
];

export default function MyCoursesScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-gray-50">
            <View
                style={{ paddingTop: insets.top }}
                className="bg-white border-b border-gray-200"
            >
                <View className="px-4 py-3 flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color="#374151"
                        />
                    </Pressable>
                    <Text className="text-xl font-bold flex-1">
                        Khóa học của tôi
                    </Text>
                </View>
            </View>

            <ScrollView>
                <View className="p-4">
                    {MY_COURSES.map((course) => (
                        <Pressable
                            key={course.id}
                            className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
                            onPress={() => router.push(`/courses/${course.id}`)}
                        >
                            <Image
                                source={{ uri: course.thumbnail }}
                                className="w-full h-48"
                            />
                            <View className="p-4">
                                <Text className="text-lg font-bold">
                                    {course.title}
                                </Text>
                                <Text className="text-gray-600 mt-1">
                                    {course.description}
                                </Text>

                                {/* Progress Bar */}
                                <View className="mt-4">
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="text-gray-600">
                                            Tiến độ học tập
                                        </Text>
                                        <Text className="text-blue-500 font-bold">
                                            {course.progress}%
                                        </Text>
                                    </View>
                                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <View
                                            className="h-2 bg-blue-500 rounded-full"
                                            style={{
                                                width: `${course.progress}%`,
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Last Lesson */}
                                <View className="mt-4 bg-blue-50 p-3 rounded-lg">
                                    <Text className="text-sm text-gray-600">
                                        Bài học gần nhất
                                    </Text>
                                    <Text className="font-medium mt-1">
                                        {course.lastLesson.title}
                                    </Text>
                                    <View className="flex-row items-center mt-2">
                                        <Text className="text-sm text-gray-500">
                                            {course.lastLesson.chapter}
                                        </Text>
                                        <Text className="text-sm text-gray-500 mx-2">
                                            •
                                        </Text>
                                        <Text className="text-sm text-gray-500">
                                            {course.lastLesson.duration}
                                        </Text>
                                    </View>
                                </View>

                                {/* Continue Button */}
                                <Pressable className="bg-blue-500 p-3 rounded-lg mt-4">
                                    <Text className="text-white text-center font-bold">
                                        Tiếp tục học
                                    </Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
} 