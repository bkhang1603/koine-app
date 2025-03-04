import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_COURSES, MOCK_USER } from "@/constants/mock-data";
import { useAppStore } from "@/components/app-provider";
import { useMyChildCoursesProgress } from "@/queries/useUser";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";

export default function CourseProgressScreen() {
  const { id, accountId } = useLocalSearchParams<{
    id: string;
    accountId: string;
  }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const childs = useAppStore((state) => state.childs);

  const {
    data: childCourseProgress,
    isError,
    refetch,
    isLoading,
  } = useMyChildCoursesProgress({
    childId: accountId,
    courseId: id,
    token: token,
  });

  const course = childCourseProgress?.data;
  const account = childs?.find((child) => child.id == accountId);

  if (isLoading) return <ActivityIndicatorScreen />;

  if (!course || !account) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title="Chi tiết tiến độ"
          showMoreOptions={false}
          returnTab={`/(root)/sub-accounts/${accountId}`}
        />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="shopping-cart" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Không tìm thấy dữ liệu môn học này
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-bold">Trở về trang chủ?</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Chi tiết tiến độ"
        showMoreOptions={false}
        returnTab={`/(root)/sub-accounts/${accountId}`}
      />
      <ScrollView>
        {/* Course Info */}
        <View className="p-4 border-b border-gray-100">
          <Text className="text-xl font-bold">{course?.courseTitle}</Text>
          <Text className="text-gray-600 mt-1">
            Học viên:{" "}
            {account?.userDetail.lastName + " " + account.userDetail.firstName}
          </Text>
        </View>

        {/* Overall Progress */}
        <View className="p-4 bg-cyan-200">
          <Image
            source={{ uri: course.courseImageUrl }}
            className="w-full h-36 rounded-lg"
          />

          <Text className="text-lg font-bold mb-3">Tổng quan</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Tiến độ tổng thể</Text>
            <Text className="font-bold">
              {course?.courseCompletionRate || 0}%
            </Text>
          </View>
          <View className="bg-white h-2 rounded-full overflow-hidden">
            <View
              className="bg-blue-500 h-full rounded-full"
              style={{
                width: `${course?.courseCompletionRate || 0}%`,
              }}
            />
          </View>
          <View className="flex-row mt-4">
            <View className="flex-1">
              <Text className="text-gray-600">Đã học</Text>
              <Text className="font-bold text-lg">
                {course?.totalLessonFinished || 0} bài
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-600">Còn lại</Text>
              <Text className="font-bold text-lg">
                {(course?.totalLesson || 0) -
                  (course?.totalLessonFinished || 0)}{" "}
                bài
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-600">Thời gian học</Text>
              <Text className="font-bold text-lg">
                {course?.totalLearningTime || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Chapters Progress */}
        <View className="p-4">
          <Text className="text-lg font-bold mb-4">Tiến độ theo chương</Text>
          {course?.chapters.map((chapter, index) => {
            const completedLessons = chapter.lessons.filter(
              (l) => l.lessonStatus == "YET"
            ).length;
            const progress = chapter.chapterCompletionRate;

            return (
              <View
                key={chapter.chapterId}
                className="bg-white rounded-xl border border-gray-100 p-4 mb-4"
              >
                <Text className="font-bold">
                  Chương {index + 1}: {chapter.chapterTitle}
                </Text>
                <Text className="text-gray-600 mt-1">
                  {chapter.chapterDescription}
                </Text>

                {/* Chapter Progress */}
                <View className="mt-3">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Tiến độ</Text>
                    <Text className="font-medium">{progress}%</Text>
                  </View>
                  <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <View
                      className="bg-blue-500 h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </View>
                </View>

                {/* Lessons List */}
                <View className="mt-3">
                  {chapter.lessons.map((lesson) => (
                    <View
                      key={lesson.lessonId}
                      className="flex-row items-center py-2 border-t border-gray-100"
                    >
                      <MaterialIcons
                        name={
                          lesson.lessonStatus == "YET"
                            ? "check-circle"
                            : "radio-button-unchecked"
                        }
                        size={20}
                        color={
                          lesson.lessonStatus == "YET" ? "#059669" : "#9CA3AF"
                        }
                      />
                      <View className="ml-3 flex-1">
                        <Text
                          className={`${
                            lesson.lessonStatus == "YET"
                              ? "text-gray-600"
                              : "text-gray-900"
                          }`}
                        >
                          {lesson.lessonTitle}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <MaterialIcons
                            name={
                              lesson.lessonType === "VIDEO"
                                ? "play-circle-outline"
                                : "article"
                            }
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-sm ml-1">
                            {lesson.lessonDurationDisplay}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
