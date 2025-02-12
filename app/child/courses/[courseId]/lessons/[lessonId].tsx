import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { MOCK_LESSONS } from "@/constants/mock-data";
import HeaderWithBack from "@/components/child/HeaderWithBack";
import WebView from "react-native-webview";

export default function LessonScreen() {
    const { courseId, lessonId } = useLocalSearchParams();
    const currentLessonIndex = MOCK_LESSONS.findIndex((l) => l.id === lessonId);
    const currentLesson = MOCK_LESSONS[currentLessonIndex];
    const prevLesson = MOCK_LESSONS[currentLessonIndex - 1];
    const nextLesson = MOCK_LESSONS[currentLessonIndex + 1];

    if (!currentLesson) return null;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title={currentLesson.title} />

            <ScrollView className="flex-1">
                {/* Progress Bar */}
                <View className="px-4 py-3 bg-violet-50">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-violet-600 font-medium">
                            Tiến độ bài học
                        </Text>
                        <Text className="text-violet-600 font-medium">
                            Bài {currentLessonIndex + 1}/{MOCK_LESSONS.length}
                        </Text>
                    </View>
                    <View className="bg-violet-100 h-2 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-violet-500 rounded-full"
                            style={{
                                width: `${
                                    ((currentLessonIndex + 1) /
                                        MOCK_LESSONS.length) *
                                    100
                                }%`,
                            }}
                        />
                    </View>
                </View>

                {/* Lesson Info */}
                <View className="p-4">
                    <View className="flex-row items-center">
                        <MaterialIcons
                            name={
                                currentLesson.type === "video"
                                    ? "play-circle-fill"
                                    : currentLesson.type === "text"
                                    ? "article"
                                    : "menu-book"
                            }
                            size={24}
                            color="#7C3AED"
                        />
                        <Text className="text-violet-600 ml-2">
                            {currentLesson.type === "video"
                                ? "Bài học video"
                                : currentLesson.type === "text"
                                ? "Bài học lý thuyết"
                                : "Bài học tổng hợp"}
                        </Text>
                        <View className="h-4 w-[1px] bg-gray-300 mx-3" />
                        <MaterialIcons name="timer" size={18} color="#6B7280" />
                        <Text className="text-gray-500 ml-1">
                            {currentLesson.duration}
                        </Text>
                    </View>
                </View>

                {/* Video Player (if lesson has video) */}
                {(currentLesson.type === "video" ||
                    currentLesson.type === "both") && (
                    <View className="px-4 mb-4">
                        <View className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                            <Pressable className="w-full h-full items-center justify-center">
                                <View className="w-16 h-16 bg-violet-500 rounded-full items-center justify-center">
                                    <MaterialIcons
                                        name="play-arrow"
                                        size={36}
                                        color="white"
                                    />
                                </View>
                            </Pressable>
                        </View>
                    </View>
                )}

                {/* Text Content (if lesson has content) */}
                {(currentLesson.type === "text" ||
                    currentLesson.type === "both") && (
                    <View className="px-4 py-2">
                        <View className="bg-gray-50 rounded-2xl p-4">
                            <WebView
                                source={{
                                    html: `
                                        <html>
                                            <head>
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                                                <style>
                                                    body {
                                                        font-family: -apple-system, system-ui;
                                                        padding: 0;
                                                        margin: 0;
                                                        font-size: 16px;
                                                        line-height: 1.5;
                                                        color: #374151;
                                                    }
                                                    h1 {
                                                        font-size: 24px;
                                                        font-weight: bold;
                                                        color: #1F2937;
                                                        margin-bottom: 16px;
                                                    }
                                                    p {
                                                        margin-bottom: 16px;
                                                    }
                                                    ul {
                                                        padding-left: 24px;
                                                        margin-bottom: 16px;
                                                    }
                                                    li {
                                                        margin-bottom: 8px;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                ${currentLesson.content || ""}
                                            </body>
                                        </html>
                                    `,
                                }}
                                style={{ height: 400 }}
                                className="bg-transparent"
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                originWhitelist={["*"]}
                            />
                        </View>
                    </View>
                )}

                {/* Navigation Buttons */}
                <View className="p-4 flex-row">
                    <Pressable
                        className={`flex-1 flex-row items-center justify-center p-4 rounded-2xl mr-2 ${
                            prevLesson
                                ? "bg-gray-100"
                                : "bg-gray-100 opacity-50"
                        }`}
                        onPress={() => {
                            if (prevLesson) {
                                router.push({
                                    pathname:
                                        "/child/courses/[courseId]/lessons/[lessonId]",
                                    params: {
                                        courseId: courseId as string,
                                        lessonId: prevLesson.id,
                                    },
                                });
                            }
                        }}
                        disabled={!prevLesson}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={20}
                            color="#374151"
                        />
                        <Text className="ml-2 font-medium text-gray-700">
                            Bài trước
                        </Text>
                    </Pressable>

                    <Pressable
                        className={`flex-1 flex-row items-center justify-center p-4 rounded-2xl ml-2 ${
                            nextLesson ? "bg-violet-500" : "bg-green-500"
                        }`}
                        onPress={() => {
                            if (nextLesson) {
                                router.push({
                                    pathname:
                                        "/child/courses/[courseId]/lessons/[lessonId]",
                                    params: {
                                        courseId: courseId as string,
                                        lessonId: nextLesson.id,
                                    },
                                });
                            } else {
                                // Handle course completion
                            }
                        }}
                    >
                        <Text className="mr-2 font-medium text-white">
                            {nextLesson ? "Bài tiếp theo" : "Hoàn thành"}
                        </Text>
                        <MaterialIcons
                            name={nextLesson ? "arrow-forward" : "check-circle"}
                            size={20}
                            color="white"
                        />
                    </Pressable>
                </View>

                {/* Lesson List */}
                <View className="p-4">
                    <Text className="text-lg font-bold mb-4">
                        Danh sách bài học
                    </Text>
                    {MOCK_LESSONS.map((lesson, index) => (
                        <Pressable
                            key={lesson.id}
                            className={`flex-row items-center p-4 rounded-2xl mb-2 ${
                                lesson.id === currentLesson.id
                                    ? "bg-violet-50 border-2 border-violet-500"
                                    : "bg-gray-50"
                            }`}
                            onPress={() =>
                                router.push({
                                    pathname:
                                        "/child/courses/[courseId]/lessons/[lessonId]",
                                    params: {
                                        courseId: courseId as string,
                                        lessonId: lesson.id,
                                    },
                                })
                            }
                        >
                            <View className="w-10 h-10 rounded-xl bg-white items-center justify-center">
                                <Text className="font-bold text-violet-500">
                                    {index + 1}
                                </Text>
                            </View>
                            <View className="flex-1 ml-3">
                                <Text
                                    className={`font-medium ${
                                        lesson.id === currentLesson.id
                                            ? "text-violet-500"
                                            : "text-gray-700"
                                    }`}
                                    numberOfLines={1}
                                >
                                    {lesson.title}
                                </Text>
                                <View className="flex-row items-center mt-1">
                                    <MaterialIcons
                                        name={
                                            lesson.type === "video"
                                                ? "play-circle-fill"
                                                : lesson.type === "text"
                                                ? "article"
                                                : "menu-book"
                                        }
                                        size={16}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-500 text-sm ml-1">
                                        {lesson.duration}
                                    </Text>
                                </View>
                            </View>
                            {lesson.completed && (
                                <MaterialIcons
                                    name="check-circle"
                                    size={24}
                                    color="#10B981"
                                />
                            )}
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
