import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/child/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useMyCourseDetail } from "@/queries/useUser";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import {
  GetMyCourseDetailResType,
  myCourseDetailRes,
} from "@/schema/user-schema";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const {
    data: courseData,
    isLoading,
    isError,
  } = useMyCourseDetail({
    courseId: id as string,
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
      <HeaderWithBack title="Chi tiết khóa học" />
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

          {/* Course Categories */}
          <View className="flex-row flex-wrap gap-2 mt-4">
            {course.categories.map((category) => (
              <View
                key={category.id}
                className="bg-blue-50 px-3 py-1 rounded-full"
              >
                <Text className="text-blue-600 text-xs font-medium">
                  {category.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Author Info */}
          <View className="ml-4 flex-row items-center mt-4">
            <MaterialIcons name="person" size={20} color="#7c3aed" />
            <Text className="text-gray-600 ml-2">Tác giả: {course.author}</Text>
          </View>

          {/* Progress Overview */}
          <View className="mt-6 bg-violet-50 p-4 rounded-xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-lg">Tiến độ học tập</Text>
              <Text className="text-violet-600 font-medium">
                {course.completionRate}% hoàn thành
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="bg-white h-2.5 rounded-full overflow-hidden flex-row">
              <View
                className="bg-violet-500 h-full rounded-full"
                style={{ flex: Number(course.completionRate) }}
              />
              <View style={{ flex: 100 - Number(course.completionRate) }} />
            </View>

            {/* Time Stats */}
            <View className="mt-4 flex-row items-center">
              <MaterialIcons name="schedule" size={20} color="#7C3AED" />
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

                  let total = "";
                  if (hours > 0) {
                    total += `${hours} giờ `;
                  }
                  if (minutes > 0 || total === "") {
                    total += `${minutes} phút`;
                  }
                  if (total === "") total = "0 phút";

                  return `Đã học ${learned} / Tổng ${total}`;
                })()}
              </Text>
            </View>
          </View>
          {/* Chapters */}
          <View className="mt-6">
            <Text className="font-bold text-lg mb-4">Nội dung khóa học</Text>
            {course.chapters.map((chapter) => (
              <View key={chapter.id}>
                <Text className="font-bold mb-2">
                  Chương {chapter.sequence}: {chapter.title}
                </Text>
                <Pressable
                  className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-4"
                  onPress={() =>
                    router.push({
                      pathname: "/child/courses/[courseId]/lessons/[lessonId]",
                      params: {
                        courseId: course.id,
                        lessonId: chapter.id,
                      },
                    })
                  }
                >
                  <MaterialIcons
                    name={
                      chapter.status === "YET"
                        ? "check-circle"
                        : "play-circle-outline"
                    }
                    size={24}
                    color={chapter.status === "YET" ? "#10B981" : "#7C3AED"}
                  />
                  <View className="flex-1 ml-3">
                    <Text className="font-medium">{chapter.title}</Text>
                    <Text className="text-gray-600 text-sm">
                      Chương {chapter.sequence}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
