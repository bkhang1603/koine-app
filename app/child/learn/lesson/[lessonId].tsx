import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import {
  useMyLessonDetail,
  useCreateProgressMutation,
} from "@/queries/useUser";
import {
  GetMyLessonDetailResType,
  myLessonDetailRes,
} from "@/schema/user-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import WebView from "react-native-webview";
import { MaterialIcons } from "@expo/vector-icons";
import VideoPlayer from "@/components/video-player";
import formatDuration from "@/util/formatDuration";

export default function LessonScreen() {
  const { lessonId, courseId, chapterId } = useLocalSearchParams<{
    lessonId: string;
    courseId: string;
    chapterId: string;
  }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const {
    data: lessonData,
    isLoading,
    isError,
  } = useMyLessonDetail({
    lessonId: lessonId as string,
    token: token as string,
  });

  const createProgressMutation = useCreateProgressMutation(token as string);

  const handleCompleteLesson = async () => {
    try {
      await createProgressMutation.mutateAsync({
        lessonId: lessonId as string,
      });
      // Sau khi hoàn thành, quay lại trang chapter
      router.push({
        pathname: "/child/learn/chapter/[chapterId]" as any,
        params: {
          chapterId: chapterId,
          courseId: courseId,
        },
      });
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  let myLesson: GetMyLessonDetailResType["data"] | null = null;

  if (lessonData && !isError) {
    if (lessonData.data === null) {
    } else {
      const parsedResult = myLessonDetailRes.safeParse(lessonData);
      if (parsedResult.success) {
        myLesson = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (isLoading) return <ActivityIndicatorScreen />;
  if (isError || !lessonData) return null;
  if (myLesson == null) return null;

  const lesson = myLesson;
  const windowWidth = Dimensions.get("window").width;

  // HTML wrapper for WebView content
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
                {formatDuration(lesson.durationDisplay)}
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

      {/* Fixed Complete Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-xl">
        <View className="px-4 py-4">
          <TouchableOpacity
            className={`w-full h-[52px] rounded-xl ${
              lesson.status === "YET"
                ? "bg-green-500 opacity-90"
                : "bg-violet-600"
            } active:opacity-80`}
            onPress={handleCompleteLesson}
            disabled={
              createProgressMutation.isPending || lesson.status === "YET"
            }
          >
            <View className="w-full h-full flex-row items-center justify-center">
              {createProgressMutation.isPending ? (
                <View className="w-6 h-6 items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : (
                <>
                  <MaterialIcons
                    name={
                      lesson.status === "YET"
                        ? "check-circle"
                        : "check-circle-outline"
                    }
                    size={24}
                    color="white"
                  />
                  <Text className="text-white font-semibold text-base ml-2">
                    {lesson.status === "YET"
                      ? "Bài học đã hoàn thành"
                      : "Đánh dấu hoàn thành"}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
