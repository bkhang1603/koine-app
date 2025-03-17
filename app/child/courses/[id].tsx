import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCourseDetail, useAssignCourse } from "@/queries/useCourse";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import {
  courseDetailRes,
  GetCourseDetailResType,
} from "@/schema/course-schema";
import { useAppStore } from "@/components/app-provider";
import { useMyCourse } from "@/queries/useUser";
import { GetMyCoursesResType, myCourseRes } from "@/schema/user-schema";

const formatDuration = (duration: string) => {
  const hours = parseInt(duration.split("h")[0]) || 0;
  const minutes = parseInt(duration.split("h")[1]?.replace("p", "")) || 0;
  let total = "";
  if (hours > 0) {
    total += `${hours} giờ `;
  }
  if (minutes > 0 || total === "") {
    total += `${minutes} phút`;
  }
  if (total === "") total = "0 phút";
  return total;
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "content" | "reviews"
  >("overview");
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken?.accessToken;

  const assignCourseMutation = useAssignCourse();

  const {
    data: courseData,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourseDetail({
    courseId: id as string,
  });

  let course: GetCourseDetailResType["data"] | null = null;

  if (courseData && !courseError) {
    if (courseData.data === null) {
    } else {
      const parsedResult = courseDetailRes.safeParse(courseData);
      if (parsedResult.success) {
        course = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  const {
    data: myCourseData,
    isLoading: myCourseLoading,
    isError: myCourseError,
  } = useMyCourse({
    token: token as string,
  });

  let myCourse: GetMyCoursesResType["data"] = [];

  if (myCourseData && !myCourseError) {
    if (myCourseData.data.length === 0) {
    } else {
      const parsedResult = myCourseRes.safeParse(myCourseData);
      if (parsedResult.success) {
        myCourse = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  const isEnrolled = useMemo(() => {
    return myCourse.some((course) => course.id === id);
  }, [myCourse, id]);

  const handleAssignCourse = async () => {
    if (!token) {
      return;
    }

    try {
      await assignCourseMutation.mutateAsync({
        body: {
          courseId: id as string,
          childId: null,
        },
        token,
      });
      router.back();
    } catch (error) {
      console.error("Failed to assign course:", error);
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const courseContent = useMemo(() => {
    if (!course || !course.chapters) return null;

    return (
      <View>
        <Text className="text-lg font-bold mb-3">Nội dung khóa học</Text>
        {course.chapters.map((chapter, chapterIndex) => (
          <View
            key={chapter.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden"
          >
            <Pressable
              onPress={() => toggleChapter(chapter.id)}
              className="px-4 py-3 bg-gray-50"
            >
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-blue-600 font-medium">
                    {chapterIndex + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-bold text-gray-800 text-base flex-1">
                      {chapter.title}
                    </Text>
                    <MaterialIcons
                      name={
                        expandedChapters.includes(chapter.id)
                          ? "keyboard-arrow-up"
                          : "keyboard-arrow-down"
                      }
                      size={24}
                      color="#4B5563"
                    />
                  </View>
                  <View className="flex-row items-center mt-1">
                    <MaterialIcons name="schedule" size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {formatDuration(chapter.durationsDisplay)}
                    </Text>
                    <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                    <MaterialIcons name="menu-book" size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {chapter.lessons.length} bài học
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {expandedChapters.includes(chapter.id) && (
              <View className="ml-11">
                {chapter.lessons.map((lesson, index) => (
                  <Pressable
                    key={lesson.id}
                    className={`flex-row items-center px-4 py-3 border-t border-gray-100
                      ${index !== 0 ? "opacity-50" : ""}`}
                    disabled={index !== 0}
                    onPress={() => {
                      if (index === 0) {
                        router.push({
                          pathname: "/child/courses/lesson/[lessonId]",
                          params: {
                            lessonId: lesson.id,
                            courseId: id,
                            chapterId: chapter.id,
                            lessonData: JSON.stringify(lesson),
                          },
                        });
                      }
                    }}
                  >
                    <View className="w-8 items-center mr-3">
                      <MaterialIcons
                        name={index === 0 ? "play-circle-fill" : "lock"}
                        size={22}
                        color={index === 0 ? "#2563EB" : "#9CA3AF"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`font-medium ${
                          index === 0 ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {lesson.title}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <MaterialIcons
                          name={
                            lesson.type === "VIDEO" ? "videocam" : "article"
                          }
                          size={14}
                          color="#6B7280"
                        />
                        <Text className="text-gray-500 text-sm ml-1">
                          {formatDuration(lesson.durationsDisplay)}
                        </Text>
                      </View>
                    </View>
                    {index === 0 && (
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color="#6B7280"
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }, [course, expandedChapters]);

  if (courseLoading && myCourseLoading) return <ActivityIndicatorScreen />;
  if (courseError)
    return (
      <ErrorScreen message="Failed to load courses. Showing default courses." />
    );

  if (course == null)
    return <ErrorScreen message="Failed to load courses. Course is null." />;
  console.log(id)

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/child/(tabs)/course")}
            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Course Thumbnail */}
        <Image source={{ uri: course.imageBanner }} className="w-full h-56" />

        {/* Course Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold">{course.title}</Text>
          <Text className="text-gray-600 mt-2">{course.description}</Text>

          <View className="flex-row items-center mt-3">
            <MaterialIcons name="star" size={20} color="#FCD34D" />
            <Text className="ml-1 font-medium">{course.aveRating}</Text>
            <Text className="text-gray-600 ml-1">
              ({course.totalEnrollment} học viên)
            </Text>
          </View>

          <View className="flex-row items-center mt-2">
            <MaterialIcons name="access-time" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-600">
              Thời lượng: {formatDuration(course.durationsDisplay)}
            </Text>
          </View>

          <View className="flex-row items-center mt-2">
            <MaterialIcons name="bar-chart" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-600">Trình độ: {course.level}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-gray-200">
          {(["overview", "content", "reviews"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={`flex-1 py-3 ${
                selectedTab === tab ? "border-b-2 border-blue-500" : ""
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedTab === tab ? "text-blue-500" : "text-gray-600"
                }`}
              >
                {tab === "overview"
                  ? "Tổng quan"
                  : tab === "content"
                  ? "Nội dung"
                  : "Đánh giá"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <View className="p-4">
          {selectedTab === "overview" && course && course.chapters && (
            <View>
              <Text className="text-lg font-bold mb-3">
                Bạn sẽ học được gì?
              </Text>
              <View className="space-y-2">
                {course.chapters.map((chapter) => (
                  <View key={chapter.id} className="flex-row items-center">
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#10B981"
                    />
                    <Text className="ml-2 text-gray-600">{chapter.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTab === "content" && courseContent}

          {selectedTab === "reviews" && (
            <View>
              <Text className="text-center text-gray-600">
                Chưa có đánh giá nào
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View
        className="bg-white border-t border-gray-200 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable
          className={`py-4 rounded-xl items-center ${
            isEnrolled
              ? "bg-green-500"
              : course.price === 0
              ? "bg-blue-500"
              : "bg-gray-400"
          }`}
          onPress={
            !isEnrolled && course.price === 0 ? handleAssignCourse : undefined
          }
          disabled={
            isEnrolled ||
            course.price > 0 ||
            (course.price === 0 && assignCourseMutation.isPending)
          }
        >
          {isEnrolled ? (
            <Text className="text-white font-bold text-base">Đã đăng ký</Text>
          ) : course.price === 0 ? (
            assignCourseMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Đăng ký khóa học
              </Text>
            )
          ) : (
            <Text className="text-white font-bold text-base">
              Đây là khóa học có phí
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
