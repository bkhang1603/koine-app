import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_COURSES } from "@/constants/mock-data";
import CartButton from "@/components/CartButton";
import { useBlogDetail } from "@/queries/useBlog";
import { useCourseDetail, useEnrollFreeCourse } from "@/queries/useCourse";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import {
  courseDetailRes,
  GetCourseDetailResType,
} from "@/schema/course-schema";
import { useCreateCartItemMutation } from "@/queries/useCart";
import { useAppStore } from "@/components/app-provider";
import formatDuration from "@/util/formatDuration";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "content" | "reviews"
  >("overview");
  const [quantity, setQuantity] = useState(1);
  const shakeAnimation = new Animated.Value(0);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const {
    data: courseData,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourseDetail({
    courseId: id as string,
  });

  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken?.accessToken;

  const createCartItemMutation = useCreateCartItemMutation();
  const enrollFreeMutation = useEnrollFreeCourse();

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

  const handleAddToCart = async () => {
    if (!token) {
      return;
    }

    try {
      await createCartItemMutation.mutateAsync({
        body: {
          courseId: id as string,
          quantity: quantity,
        },
        token,
      });
      Alert.alert("Thông báo", "Thêm khóa học vào giỏ thành công", [
        {
          text: "Mua tiếp",
          style: "cancel",
        },
        {
          text: "Trang chủ",
          onPress: () => {
            router.push("/(tabs)/home");
          },
          style: "destructive",
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", `Không thêm được khóa học ${error}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
    }
  };

  const handleEnrollFreeCourse = async () => {
    if (!token) {
      return;
    }

    try {
      await enrollFreeMutation.mutateAsync({
        token,
        courseId: id as string,
      });
      router.back();
    } catch (error) {
      console.error("Failed to enroll:", error);
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev: string[]) =>
      prev.includes(chapterId)
        ? prev.filter((id: string) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  if (courseLoading) return <ActivityIndicatorScreen />;
  if (courseError)
    return (
      <ErrorScreen message="Failed to load courses. Showing default courses." />
    );

  if (course == null)
    return <ErrorScreen message="Failed to load courses. Course is null." />;

  return (
    <View className="flex-1 bg-white">
      {/* Header - Redesigned with gradient background */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="px-4 py-3 flex-row items-center justify-between backdrop-blur-sm">
          <Pressable
            onPress={() => router.push("/(tabs)/course/course")}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="flex-row items-center">
            <CartButton bgColor="bg-white/20" iconColor="white" />
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 ml-2"
              onPress={() => router.push("/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Course Thumbnail with shadow overlay */}
        <View className="relative">
          <Image source={{ uri: course.imageBanner }} className="w-full h-64" />
          <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        </View>

        {/* Course Info - Redesigned with card style */}
        <View className="p-5 -mt-4 rounded-t-3xl bg-white">
          <Text className="text-2xl font-bold">{course.title}</Text>

          <View className="flex-row items-center justify-between mt-3 bg-blue-50 p-3 rounded-xl">
            <View className="flex-row items-center">
              <MaterialIcons name="star" size={22} color="#FFA000" />
              <Text className="ml-1 font-semibold text-lg">
                {course.aveRating == 0 ? 5 : course.aveRating}
              </Text>
            </View>

            <View className="flex-row items-center">
              <MaterialIcons name="people" size={22} color="#0277BD" />
              <Text className="ml-1 font-medium text-base">
                {course.totalEnrollment} học viên
              </Text>
            </View>

            <View className="flex-row items-center">
              <MaterialIcons name="bar-chart" size={22} color="#7B1FA2" />
              <Text className="ml-1 font-medium text-base">{course.level}</Text>
            </View>
          </View>

          <View className="mt-4 flex-row items-center bg-amber-50 p-3 rounded-xl">
            <MaterialIcons name="access-time" size={24} color="#E65100" />
            <Text className="ml-2 text-gray-700 text-base font-medium">
              Thời lượng: {formatDuration(course.durationsDisplay)}
            </Text>
          </View>

          <Text className="text-gray-700 mt-4 text-base leading-6">
            {course.description}
          </Text>
        </View>

        {/* Tabs - Redesigned with pill style */}
        <View className="mx-4 mt-3 mb-1 p-1 flex-row bg-gray-100 rounded-full">
          {(["overview", "content", "reviews"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={`flex-1 py-2.5 ${
                selectedTab === tab
                  ? "bg-white rounded-full shadow-sm"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedTab === tab ? "text-blue-600" : "text-gray-500"
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

        {/* Tab Content - Redesigned with better spacing */}
        <View className="p-4 mt-2">
          {selectedTab === "overview" && course && course.chapters && (
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Text className="text-xl font-bold mb-4">
                Bạn sẽ học được gì?
              </Text>
              <View className="space-y-3">
                {course.chapters.map((chapter) => (
                  <View key={chapter.id} className="flex-row items-start">
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color="#10B981"
                      style={{ marginTop: 2 }}
                    />
                    <Text className="ml-3 text-gray-700 text-base flex-1">
                      {chapter.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTab === "content" && course && course.chapters && (
            <View>
              <Text className="text-xl font-bold mb-4">Nội dung khóa học</Text>
              {course.chapters.map((chapter, chapterIndex) => (
                <View
                  key={chapter.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
                >
                  <Pressable
                    onPress={() => toggleChapter(chapter.id)}
                    className="px-4 py-4 bg-gray-50"
                  >
                    <View className="flex-row items-start">
                      <View className="w-9 h-9 bg-blue-600 rounded-full items-center justify-center mr-3">
                        <Text className="text-white font-bold">
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
                            size={28}
                            color="#4B5563"
                          />
                        </View>
                        <View className="flex-row items-center mt-1">
                          <MaterialIcons
                            name="schedule"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-sm ml-1">
                            {chapter.durationsDisplay}
                          </Text>
                          <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                          <MaterialIcons
                            name="menu-book"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-sm ml-1">
                            {chapter.lessons.length} bài học
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>

                  {expandedChapters.includes(chapter.id) && (
                    <View className="ml-12 border-l border-gray-200">
                      {chapter.lessons.map((lesson, index) => {
                        const isFirstChapterFirstLesson =
                          chapterIndex === 0 && index === 0;
                        return (
                          <Pressable
                            key={lesson.id}
                            className={`flex-row items-center px-4 py-3.5 border-t border-gray-100
                              ${
                                !isFirstChapterFirstLesson ? "opacity-50" : ""
                              }`}
                            disabled={!isFirstChapterFirstLesson}
                            onPress={() => {
                              if (isFirstChapterFirstLesson) {
                                router.push({
                                  pathname: "/courses/lesson/[lessonId]",
                                  params: {
                                    lessonId: lesson.id,
                                    courseId: id,
                                    lessonData: JSON.stringify(lesson),
                                  },
                                });
                              }
                            }}
                          >
                            <View className="w-8 items-center mr-3">
                              <MaterialIcons
                                name={
                                  isFirstChapterFirstLesson
                                    ? "play-circle-fill"
                                    : "lock"
                                }
                                size={22}
                                color={
                                  isFirstChapterFirstLesson
                                    ? "#2563EB"
                                    : "#9CA3AF"
                                }
                              />
                            </View>
                            <View className="flex-1">
                              <Text
                                className={`font-medium ${
                                  isFirstChapterFirstLesson
                                    ? "text-gray-800"
                                    : "text-gray-400"
                                }`}
                              >
                                {lesson.title}
                              </Text>
                              <View className="flex-row items-center mt-1">
                                <MaterialIcons
                                  name={
                                    lesson.type === "VIDEO"
                                      ? "videocam"
                                      : "article"
                                  }
                                  size={14}
                                  color="#6B7280"
                                />
                                <Text className="text-gray-500 text-sm ml-1">
                                  {lesson.durationsDisplay}
                                </Text>
                              </View>
                            </View>
                            {isFirstChapterFirstLesson && (
                              <MaterialIcons
                                name="chevron-right"
                                size={20}
                                color="#6B7280"
                              />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {selectedTab === "reviews" && (
            <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 items-center justify-center py-12">
              <MaterialIcons name="star-border" size={48} color="#9CA3AF" />
              <Text className="text-center text-gray-500 mt-3 text-base">
                Chưa có đánh giá nào cho khóa học này
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action - Redesigned with cleaner layout */}
      <View
        className="bg-white border-t border-gray-100 px-6 py-4 shadow-lg"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-gray-500 text-sm mb-1">Học phí</Text>
            <Text className="text-2xl font-bold text-blue-600">
              {course.price === 0
                ? "Miễn phí"
                : `${course.price.toLocaleString("vi-VN")} ₫`}
            </Text>
          </View>

          {course.price > 0 && (
            <View className="bg-gray-50 px-3 py-2 rounded-lg">
              <Text className="text-gray-500 text-xs mb-2 text-center">
                Số lượng
              </Text>
              <View className="flex-row items-center">
                <Pressable
                  className="w-8 h-8 items-center justify-center rounded-lg bg-gray-200"
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MaterialIcons
                    name="remove"
                    size={20}
                    color={quantity <= 1 ? "#9CA3AF" : "#374151"}
                  />
                </Pressable>
                <Animated.Text
                  className="mx-4 font-semibold text-lg"
                  style={{ transform: [{ translateX: shakeAnimation }] }}
                >
                  {quantity}
                </Animated.Text>
                <Pressable
                  className="w-8 h-8 items-center justify-center rounded-lg bg-gray-200"
                  onPress={() => {
                    if (quantity >= 3) {
                      shake();
                    } else {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  <MaterialIcons
                    name="add"
                    size={20}
                    color={quantity >= 3 ? "#9CA3AF" : "#374151"}
                  />
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Pressable
          className={`h-[56px] rounded-xl items-center justify-center ${
            course.price === 0 ? "bg-green-500" : "bg-blue-600"
          } ${
            (
              course.price === 0
                ? enrollFreeMutation.isPending
                : createCartItemMutation.isPending
            )
              ? "opacity-70"
              : ""
          }`}
          onPress={
            course.price === 0 ? handleEnrollFreeCourse : handleAddToCart
          }
          disabled={
            course.price === 0
              ? enrollFreeMutation.isPending
              : createCartItemMutation.isPending
          }
        >
          <View className="flex-row items-center justify-center">
            {course.price === 0 ? (
              enrollFreeMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons
                    name="school"
                    size={20}
                    color="white"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-white font-bold text-base">
                    Đăng ký khóa học
                  </Text>
                </>
              )
            ) : createCartItemMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialIcons
                  name="shopping-cart"
                  size={20}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-white font-bold text-base">
                  Thêm vào giỏ hàng •{" "}
                  {(course.price * quantity).toLocaleString("vi-VN")} ₫
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}
