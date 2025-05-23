import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { useAppStore } from "@/components/app-provider";
import {
  GetMyChapterDetailResType,
  myChapterDetailRes,
} from "@/schema/user-schema";
import { useMyChapterDetail } from "@/queries/useUser";
import formatDuration from "@/util/formatDuration";

export default function ChapterScreen() {
  const { chapterId, courseId, message } = useLocalSearchParams<{
    chapterId: string;
    courseId: string;
    message: string;
  }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [showModal, setShowModal] = useState(false);

  const {
    data: chapterData,
    isLoading,
    isError,
  } = useMyChapterDetail({
    chapterId: chapterId as string,
    token: token as string,
  });

  let myChapter: GetMyChapterDetailResType["data"] | null = null;

  useEffect(() => {
    if (message && message.length != 0) {
      setShowModal(true);
      const timeout = setTimeout(() => {
        setShowModal(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  if (chapterData && !isError) {
    if (chapterData.data === null) {
    } else {
      const parsedResult = myChapterDetailRes.safeParse(chapterData);
      if (parsedResult.success) {
        myChapter = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (isLoading) return <ActivityIndicatorScreen />;
  if (isError || !chapterData) return null;
  if (myChapter == null) return null;

  const chapter = myChapter;

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Chi tiết chương"
        returnTab={`/child/learn/course/${courseId}`}
        showMoreOptions={false}
      />
      <ScrollView className="flex-1 p-4">
        {showModal && (
          <View className="absolute border-2 top-8 left-5 right-5 bg-green-200 p-4 rounded-xl shadow-lg z-50">
            <Text className="text-red-500 text-center font-medium">
              Tài khoản đang học trên thiết bị khác
            </Text>
          </View>
        )}
        {/* Chapter Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold">
            Chương {chapter.sequence}: {chapter.title}
          </Text>
          <Text className="text-gray-600 mt-2">{chapter.description}</Text>

          <View className="flex-row items-center mt-4">
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={20} color="#8B5CF6" />
              <Text className="text-gray-600 ml-2">
                {formatDuration(chapter.durationDisplay)}
              </Text>
            </View>
            <Text className="mx-2 text-gray-400">•</Text>
            <View className="flex-row items-center">
              <MaterialIcons
                name={
                  chapter.status === "YET"
                    ? "check-circle"
                    : "play-circle-outline"
                }
                size={20}
                color={chapter.status === "YET" ? "#10B981" : "#8B5CF6"}
              />
              <Text className="text-gray-600 ml-2">
                {chapter.status === "YET" ? "Đã hoàn thành" : "Chưa hoàn thành"}
              </Text>
            </View>
            {chapter.score != null ? (
              <Text className="text-gray-600 ml-2">Điểm: {chapter.score}</Text>
            ) : null}
          </View>
        </View>

        {/* Lessons List */}
        <View>
          <Text className="text-lg font-bold mb-4">Danh sách bài học</Text>
          {chapter.lessons.map((lesson, index) => {
            // Kiểm tra xem bài học trước đó đã hoàn thành chưa
            const previousLesson =
              index > 0 ? chapter.lessons[index - 1] : null;
            const isLocked = previousLesson && previousLesson.status !== "YET";

            return (
              <Pressable
                key={lesson.id}
                className={`bg-gray-50 rounded-xl mb-3 p-4 ${
                  isLocked ? "opacity-60" : ""
                }`}
                onPress={() => {
                  if (!isLocked) {
                    router.push({
                      pathname: "/child/learn/lesson/[lessonId]" as any,
                      params: {
                        lessonId: lesson.id,
                        courseId: courseId,
                        chapterId: chapter.id,
                      },
                    });
                  }
                }}
                disabled={isLocked}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name={
                          lesson.status === "YET"
                            ? "check-circle"
                            : "play-circle-outline"
                        }
                        size={24}
                        color={
                          isLocked
                            ? "#9CA3AF"
                            : lesson.status === "YET"
                            ? "#10B981"
                            : "#8B5CF6"
                        }
                      />
                      <Text
                        className={`font-medium ml-3 flex-1 ${
                          isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        Bài {lesson.sequence}: {lesson.title}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-2 ml-9">
                      <MaterialIcons
                        name="schedule"
                        size={20}
                        color={isLocked ? "#9CA3AF" : "#8B5CF6"}
                      />
                      <Text
                        className={`text-sm ml-1 ${
                          isLocked ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {formatDuration(lesson.durationDisplay)}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={isLocked ? "#9CA3AF" : "#6B7280"}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* chapter.isQuestion */}
        {chapter.isQuestion ? (
          <View>
            <Text className="text-lg font-bold mb-4">Bài kiểm tra</Text>
            <Pressable
              className={`bg-gray-50 rounded-xl mb-3 p-4 ${
                chapter.status != "YET" ? "opacity-60" : ""
              }`}
              onPress={() => {
                if (!(chapter.status != "YET")) {
                  router.push({
                    pathname: "/child/learn/question/[chapterId]" as any,
                    params: {
                      chapterId: chapterId,
                      courseId: courseId,
                    },
                  });
                }
              }}
              disabled={chapter.status != "YET"}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name={
                        chapter.status != "YET"
                          ? "lock"
                          : chapter.score == null
                          ? "play-circle-outline"
                          : chapter.score >= 70
                          ? "check-circle"
                          : "warning"
                      }
                      size={24}
                      color={
                        chapter.status != "YET"
                          ? "#9CA3AF"
                          : chapter.score == null
                          ? "#3B82F6"
                          : chapter.score >= 70
                          ? "#10B981"
                          : "red"
                      }
                    />
                    <Text
                      className={`font-medium ml-3 flex-1 ${
                        chapter.status != "YET"
                          ? "text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      Bài kiểm tra chương{" "}
                      {chapter.score != null
                        ? " - " + chapter.score + " điểm"
                        : ""}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-2 ml-9">
                    <MaterialIcons
                      name="schedule"
                      size={20}
                      color={chapter.status != "YET" ? "#9CA3AF" : "#8B5CF6"}
                    />
                    <Text
                      className={`text-sm ml-1 ${
                        chapter.status != "YET"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      10 phút
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={chapter.status != "YET" ? "#9CA3AF" : "#6B7280"}
                />
              </View>
            </Pressable>
          </View>
        ) : null}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
