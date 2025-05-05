import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { useAppStore } from "@/components/app-provider";
import {
  useMyLessonDetail,
  useCreateProgressMutation,
  useStillLearning,
  useUpdateLearningTimeMutation,
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

  const { refetch: refetchStill } = useStillLearning({ token });

  const updateLearningTime = useUpdateLearningTimeMutation();

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference to interval

  const insets = useSafeAreaInsets();

  // Flag to track if component is mounted or focused
  const isMounted = useRef(true);

  //unmount signal send to video player to release
  const [unmountSignal, setUnmountSignal] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      isMounted.current = true; // Component is focused

      // Nếu lessonData chưa có, không setup interval
      if (!lessonData) {
        return;
      }
      // Setup interval when screen is focused
      intervalRef.current = setInterval(async () => {
        if (!isMounted.current) return; // Skip if not mounted

        try {
          // Refetch API to check status
          const result = await refetchStill();

          if (result.isError) {
            router.push({
              pathname: "/(root)/learn/chapter/[chapterId]",
              params: { chapterId, courseId, message: "error" },
            });
            return;
          }

          const res = await updateLearningTime.mutateAsync({
            body: { lessonId, learningTime: 30 },
            token,
          });
          console.log("refetch chạy ở cha không lỗi");
        } catch (error) {
          console.error("Lỗi khi refetchStill hoặc updateLearningTime:", error);
          router.push({
            pathname: "/(root)/learn/chapter/[chapterId]",
            params: { chapterId, courseId, message: "error" },
          });
        }
      }, 30 * 1000); // Every 30 seconds

      return () => {
        clearInterval(intervalRef.current as NodeJS.Timeout); // Cleanup on focus loss
        isMounted.current = false; // Component is no longer focused
        setUnmountSignal(true);
      };
    }, [
      lessonData,
      lessonId,
      courseId,
      chapterId,
      refetchStill,
      token,
      updateLearningTime,
    ])
  );

  const createProgressMutation = useCreateProgressMutation(token as string);

  const handleCompleteLesson = async () => {
    try {
      await createProgressMutation.mutateAsync({
        lessonId: lessonId as string,
        courseId: courseId as string,
      });
      router.push({
        pathname: "/learn/chapter/[chapterId]" as any,
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0 , maximum-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 0;
            margin: 0;
            color: #1F2937;
          }
          .content-wrapper {
            height: 100vh; /* Đảm bảo chiều cao của wrapper sẽ chiếm toàn bộ chiều cao màn hình */
            box-sizing: border-box;
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
        <div class="content-wrapper">
          ${lesson.content || ""}
        </div>
      </body>
    </html>
  `;

  return (
    <View className="flex-1 bg-white">
      {/* Headers */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Pressable
            onPress={() =>
              router.push(`/learn/chapter/${chapterId}?courseId=${courseId}`)
            }
            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      <SafeAreaView className="flex-1">
        {/* Lesson Header */}
        <View className="p-4 mt-1 border-b border-gray-200">
          <Text className="text-xl font-bold mb-2">
            Bài {lesson.sequence}: {lesson.title}
          </Text>
          <Text numberOfLines={2} className="text-gray-600 mb-3">
            {lesson.description}
          </Text>

          <View className="flex-row items-center space-x-4">
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={20} color="#3B82F6" />
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

        <View className="flex-1">
          {/* Video Section */}
          {(lesson.type === "VIDEO" || lesson.type === "BOTH") &&
            lesson.videoUrl && (
              <View className="w-full">
                <VideoPlayer
                  videoUrl={lesson.videoUrl}
                  onUnmountSignal={unmountSignal}
                />
              </View>
            )}

          {/* Content Section */}
          {(lesson.type === "DOCUMENT" || lesson.type === "BOTH") &&
            lesson.content && (
              <View className="flex-1 px-4 py-2">
                <WebView
                  source={{ html: htmlContent }}
                  style={{ flex: 1 }}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  originWhitelist={["*"]}
                />
                <View className="h-20"></View>
              </View>
            )}
        </View>
      </SafeAreaView>

      {/* Fixed Complete Button */}
      <View className="absolute bottom-0 left-0 right-0 shadow-xl">
        <View className="px-4 py-4">
          <TouchableOpacity
            className={`w-full h-[52px] rounded-xl ${
              lesson.status === "YET"
                ? "bg-green-500 opacity-90"
                : "bg-blue-600"
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
