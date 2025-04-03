import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import {
  GetMyCourseDetailResType,
  myCourseDetailRes,
} from "@/schema/user-schema";
import { useAppStore } from "@/components/app-provider";
import { useMyCourseDetail } from "@/queries/useUser";
import blog from "@/app/(tabs)/blog/blog";
import formatDuration from "@/util/formatDuration";

export default function CourseLearnScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const {
    data: courseData,
    isLoading,
    isError,
  } = useMyCourseDetail({
    courseId: courseId as string,
    token: token as string,
  });

  let myCourse: GetMyCourseDetailResType["data"] | null = null;

  if (courseData && !isError) {
    if (courseData.data === null) {
    } else {
      const parsedResult = myCourseDetailRes.safeParse(courseData);
      if (parsedResult.success) {
        myCourse = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (isLoading) return <ActivityIndicatorScreen />;
  if (isError || !courseData) return null;
  if (myCourse == null) return null;

  const course = myCourse;

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title={"Chi tiết khóa học"}
        returnTab={"/child/(tabs)/my-courses"}
        showMoreOptions={false}
      />
      <ScrollView>
        {/* Banner Image */}
        <Image
          source={{ uri: course.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="p-4">
          <Text className="text-2xl font-bold">{course.title}</Text>
          <Text className="text-gray-600 mt-2">{course.description}</Text>

          {/* Author Info */}
          <View className="flex-row items-center mt-4">
            <MaterialIcons name="person" size={20} color="#8B5CF6" />
            <Text className="text-gray-600 ml-2">Tác giả: {course.author}</Text>
          </View>

          {/* Course Categories */}
          <View className="flex-row flex-wrap gap-2 mt-1 mb-4">
            {course.categories.map((category) => (
              <View
                key={category.id}
                className="bg-violet-50 px-3 py-1 rounded-full"
              >
                <Text className="text-violet-600 text-xs font-medium">
                  {category.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Overview */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-lg">Tiến độ học tập</Text>
            <Text className="text-violet-600 font-medium">
              {course.completionRate}% hoàn thành
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <View
              className={`h-full rounded-full ${
                course.completionRate === 100 ? "bg-green-500" : "bg-violet-500"
              }`}
              style={{
                width: `${Math.max(2, course.completionRate)}%`,
                opacity: course.completionRate === 0 ? 0.5 : 1,
              }}
            />
          </View>

          {/* Time Stats */}
          <View className="mt-4 flex-row items-center">
            <MaterialIcons name="schedule" size={20} color="#8B5CF6" />
            <Text className="text-gray-600 ml-2">
              {(() => {
                const duration = course.durationDisplay;
                const hours = parseInt(duration.split("h")[0]) || 0;
                const minutes =
                  parseInt(duration.split("h")[1].replace("p", "")) || 0;

                const totalMinutes = hours * 60 + minutes;
                const completionRate = Number(course.completionRate);
                const learnedMinutes = Math.round(
                  (totalMinutes * completionRate) / 100
                );
                const learnedHours = Math.floor(learnedMinutes / 60);
                const remainingMinutes = learnedMinutes % 60;

                let learned = "";
                if (learnedHours > 0) {
                  learned += `${learnedHours} giờ `;
                }
                if (remainingMinutes > 0 || learned === "") {
                  learned += `${remainingMinutes} phút`;
                }
                if (learned === "") learned = "0 phút";

                return `Đã học ${learned} / ${formatDuration(
                  course.durationDisplay
                )}`;
              })()}
            </Text>
          </View>

          {/* Chapters */}
          <View className="mt-6">
            <Text className="font-bold text-lg mb-4">Nội dung khóa học</Text>
            {course.chapters.map((chapter, index) => {
              // Kiểm tra xem chương trước đó đã hoàn thành chưa
              const previousChapter =
                index > 0 ? course.chapters[index - 1] : null;
              let isLocked = false;
              if (previousChapter == null) {
                isLocked = false;
              } else if (
                previousChapter != null &&
                previousChapter.status != "YET"
              ) {
                isLocked = true;
              } else if (
                previousChapter != null &&
                previousChapter.status == "YET" &&
                !previousChapter.isQuestion
              ) {
                isLocked = false;
              } else if (
                previousChapter != null &&
                previousChapter.status == "YET" &&
                previousChapter.isQuestion &&
                (previousChapter.score == null ||
                  (previousChapter.score != null && previousChapter.score < 70))
              ) {
                isLocked = true;
              } else if (
                previousChapter != null &&
                previousChapter.status == "YET" &&
                previousChapter.isQuestion &&
                previousChapter.score &&
                previousChapter.score >= 70
              ) {
                isLocked = false;
              }
              return (
                <View key={chapter.id}>
                  <Text
                    className={`font-bold mb-2 ${
                      isLocked ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    Chương {chapter.sequence}: {chapter.title}
                  </Text>
                  <Pressable
                    className={`flex-row items-center bg-gray-50 p-4 rounded-xl mb-4 ${
                      isLocked ? "opacity-60" : ""
                    }`}
                    onPress={() => {
                      if (!isLocked) {
                        router.push({
                          pathname: "/child/learn/chapter/[chapterId]" as any,
                          params: {
                            chapterId: chapter.id,
                            courseId: course.id,
                          },
                        });
                      }
                    }}
                    disabled={isLocked}
                  >
                    <MaterialIcons
                      name={
                        (chapter.status == "YET" &&
                          chapter.score &&
                          chapter.score >= 70) ||
                        (chapter.status == "YET" && !chapter.isQuestion)
                          ? "check-circle"
                          : "play-circle-outline"
                      }
                      size={24}
                      color={
                        isLocked
                          ? // màu xám
                            "#9CA3AF"
                          : (chapter.status == "YET" &&
                              chapter.score &&
                              chapter.score >= 70) ||
                            (chapter.status == "YET" && !chapter.isQuestion)
                          ? // màu xanh lá
                            "#10B981"
                          : //màu xanh dương
                            "#3B82F6"
                      }
                    />
                    <View className="flex-1 ml-3">
                      <Text
                        className={`font-medium ${
                          isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {chapter.title}
                      </Text>
                      <Text
                        className={`text-sm ${
                          isLocked ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Chương {chapter.sequence}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={isLocked ? "#9CA3AF" : "#6B7280"}
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
