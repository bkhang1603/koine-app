import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_MY_COURSES } from "@/constants/mock-data";

export default function LessonScreen() {
    const { courseId, lessonId } = useLocalSearchParams<{
        courseId: string;
        lessonId: string;
    }>();

    const course = MOCK_MY_COURSES.find((c) => c.id === courseId);
    const chapter = course?.chapters.find((ch) =>
        ch.lessons.some((l) => l.id === lessonId)
    );
    const lesson = chapter?.lessons.find((l) => l.id === lessonId);

    if (!course || !chapter || !lesson) return null;

    const currentLessonIndex = chapter.lessons.findIndex(
        (l) => l.id === lessonId
    );
    const previousLesson = chapter.lessons[currentLessonIndex - 1];
    const nextLesson = chapter.lessons[currentLessonIndex + 1];

    // Find next chapter's first lesson if current chapter ends
    const currentChapterIndex = course.chapters.findIndex(
        (ch) => ch.id === chapter.id
    );
    const nextChapter = course.chapters[currentChapterIndex + 1];
    const nextChapterFirstLesson = nextChapter?.lessons[0];

    const handleComplete = () => {
        // TODO: Mark lesson as completed
        if (nextLesson) {
            router.push({
                pathname: "/learn/[courseId]/lessons/[lessonId]" as any,
                params: {
                    courseId,
                    lessonId: nextLesson.id,
                },
            });
        } else if (nextChapterFirstLesson) {
            router.push({
                pathname: "/learn/[courseId]/lessons/[lessonId]" as any,
                params: {
                    courseId,
                    lessonId: nextChapterFirstLesson.id,
                },
            });
        }
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title={chapter.title} />
            <ScrollView>
                <View className="p-4">
                    <Text className="text-xl font-bold">{lesson.title}</Text>
                    <View className="flex-row items-center mt-2">
                        <MaterialIcons
                            name="schedule"
                            size={16}
                            color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-1">
                            {lesson.duration}
                        </Text>
                    </View>

                    {/* Lesson Content */}
                    <View className="mt-4">
                        {lesson.type === "video" ? (
                            <View className="aspect-video bg-black rounded-xl items-center justify-center">
                                <MaterialIcons
                                    name="play-circle-fill"
                                    size={48}
                                    color="#fff"
                                />
                            </View>
                        ) : (
                            <WebView
                                source={{
                                    html: `
                                        <html>
                                            <head>
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                <style>
                                                    body {
                                                        font-family: system-ui;
                                                        font-size: 16px;
                                                        line-height: 1.6;
                                                        color: #374151;
                                                        padding: 16px;
                                                    }
                                                    h1, h2, h3 {
                                                        color: #111827;
                                                        margin-top: 1.5em;
                                                    }
                                                    p {
                                                        margin-bottom: 1em;
                                                    }
                                                    img {
                                                        max-width: 100%;
                                                        height: auto;
                                                        border-radius: 8px;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                ${
                                                    lesson.content ||
                                                    "<h1>Nội dung bài học</h1><p>Nội dung đang được cập nhật...</p>"
                                                }
                                            </body>
                                        </html>
                                    `,
                                }}
                                style={{ height: 400 }}
                                scalesPageToFit={false}
                            />
                        )}
                    </View>

                    {/* Navigation */}
                    <View className="p-4 border-t border-gray-100 mt-6">
                        <View className="flex-row items-center justify-between">
                            {previousLesson ? (
                                <Pressable
                                    className="bg-gray-100 px-6 py-2 rounded-xl"
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/learn/[courseId]/lessons/[lessonId]" as any,
                                            params: {
                                                courseId,
                                                lessonId: previousLesson.id,
                                            },
                                        })
                                    }
                                >
                                    <Text className="text-gray-700">
                                        Quay lại
                                    </Text>
                                </Pressable>
                            ) : (
                                <View style={{ width: 100 }} />
                            )}

                            <Pressable
                                className="bg-blue-500 px-6 py-2 rounded-xl"
                                onPress={handleComplete}
                            >
                                <Text className="text-white font-medium">
                                    {nextLesson || nextChapterFirstLesson
                                        ? "Tiếp tục"
                                        : "Hoàn thành"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
