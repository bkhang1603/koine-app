import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_COURSES, MOCK_USER } from "@/constants/mock-data";
import { useAppStore } from "@/components/app-provider";
import { useMyChildCoursesProgress } from "@/queries/useUser";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { useEditChildCourseVisible } from "@/queries/useCourse";
import formatDuration from "@/util/formatDuration";

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

  const [isProcessing, setIsProcessing] = useState(false);
  const hide = useEditChildCourseVisible();

  useFocusEffect(() => {
    refetch();
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

  const handleHide = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);

      Alert.alert(
        "Xác nhận",
        `Bạn có chắc chắn muốn ${
          childCourseProgress.data.isAccessibleByChild == true ? "ẩn" : "hiện"
        } khóa học?\n${
          account.userDetail.lastName + " " + account.userDetail.firstName
        } ${
          childCourseProgress.data.isAccessibleByChild == true
            ? "sẽ không thấy khóa học này nữa"
            : "sẽ thấy khóa học này"
        }`,
        [
          {
            text: "Hủy",
            style: "cancel",
            onPress: () => {
              setIsProcessing(false); // Đặt lại trạng thái khi hủy
            },
          },
          {
            text: `${
              childCourseProgress.data.isAccessibleByChild == true
                ? "ẩn"
                : "hiện"
            }`,
            style: "destructive",
            onPress: async () => {
              try {
                const body = {
                  childId: account.id,
                  courseId: course.courseId,
                  isVisible: !course.isAccessibleByChild,
                };
                console.log(body);
                const res = await hide.mutateAsync({
                  token: token,
                  body: body,
                });
                if (res) {
                  refetch();
                }
              } catch (error) {
                Alert.alert("Lỗi", `Thao tác thất bại ${error}`, [
                  { text: "Tắt", style: "cancel" },
                ]);
              } finally {
                setIsProcessing(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Lỗi", `Thao tác thất bại ${error}`, [
        { text: "Tắt", style: "cancel" },
      ]);
      setIsProcessing(false);
    }
  };

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
          <View className="flex-row items-center">
            <Text className="text-gray-600 mt-1">Trạng thái:</Text>

            {childCourseProgress.data.isAccessibleByChild == true ? (
              <View className="mt-1 ml-1 p-1 px-2 bg-cyan-400 rounded-xl">
                <Text className="text-gray-600">Đang hiển thị</Text>
              </View>
            ) : (
              <View className="mt-1 ml-1 p-1 px-2 bg-gray-400 rounded-xl">
                <Text className="text-gray-600">Đang ẩn</Text>
              </View>
            )}
          </View>
          <Pressable
            className="bg-slate-300 self-start p-2 mt-1 rounded-xl"
            onPress={handleHide}
            hitSlop={8}
          >
            <MaterialIcons
              name={
                childCourseProgress.data.isAccessibleByChild == true
                  ? "visibility"
                  : "visibility-off"
              }
              size={24}
              color="#6B7280"
            />
          </Pressable>
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
                {formatDuration(course?.totalLearningTime || "0")}
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
                  {chapter.lessons.map((lesson, index) => (
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
                          Bài {index + 1}: {lesson.lessonTitle}
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
                            {formatDuration(lesson.lessonDurationDisplay)}
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
