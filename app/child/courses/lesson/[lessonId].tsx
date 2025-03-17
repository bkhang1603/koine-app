import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useCreateProgressMutation } from "@/queries/useUser";
import WebView from "react-native-webview";
import { MaterialIcons } from "@expo/vector-icons";
import VideoPlayer from "@/components/video-player";
import { useAssignCourse } from "@/queries/useCourse";
import { useCourses } from "@/queries/useCourse";
import { myCourseRes } from "@/schema/user-schema";

const formatDuration = (durationDisplay: string) => {
  const hours = parseInt(durationDisplay.split("h")[0]) || 0;
  const minutes =
    parseInt(durationDisplay.split("h")[1]?.replace("p", "")) || 0;
  let result = "";
  if (hours > 0) {
    result += `${hours} giờ `;
  }
  if (minutes > 0 || result === "") {
    result += `${minutes} phút`;
  }
  return result;
};

export default function LessonScreen() {
  const { courseId, chapterId, lessonData } =
    useLocalSearchParams();
  const lesson = JSON.parse(lessonData as string);

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 0;
            margin: 0;
            color: #1F2937;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 16px;
          }
          strong {
            color: #111827;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        ${lesson.content || ""}
      </body>
    </html>
  `;

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Chi tiết bài học"
        returnTab={`/child/learn/chapter/${chapterId}?courseId=${courseId}`}
        showMoreOptions={false}
      />

      <ScrollView className="flex-1">
        {/* Lesson Header */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-2xl font-bold mb-2">{lesson.title}</Text>
          <Text className="text-gray-600 mb-3">{lesson.description}</Text>

          <View className="flex-row items-center space-x-4">
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={20} color="#8B5CF6" />
              <Text className="text-gray-600 ml-2">
                {formatDuration(lesson.durationsDisplay)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons
                name={
                  lesson.type === "VIDEO"
                    ? "videocam"
                    : lesson.type === "DOCUMENT"
                    ? "description"
                    : "library-books"
                }
                size={20}
                color="#3B82F6"
              />
              <Text className="text-gray-600 ml-2">
                {lesson.type === "VIDEO"
                  ? "Video"
                  : lesson.type === "DOCUMENT"
                  ? "Tài liệu"
                  : "Video & Tài liệu"}
              </Text>
            </View>
          </View>
        </View>

        {/* Video Section */}
        {(lesson.type === "VIDEO" || lesson.type === "BOTH") &&
          lesson.videoUrl && (
            <View className="w-full">
              <VideoPlayer videoUrl={lesson.videoUrl} />
            </View>
          )}

        {/* Content Section */}
        {(lesson.type === "DOCUMENT" || lesson.type === "BOTH") &&
          lesson.content && (
            <View className="flex-1 bg-white p-4">
              <WebView
                source={{ html: htmlContent }}
                style={{ flex: 1, height: 1000 }}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                originWhitelist={["*"]}
              />
            </View>
          )}

        {/* Add padding at bottom for fixed button */}
        <View className="h-28" />
      </ScrollView>
    </View>
  );
}
