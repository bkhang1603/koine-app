import React, { useState } from "react";
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
import { Alert } from "react-native";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "content" | "reviews"
  >("overview");
  const [quantity, setQuantity] = useState(1);
  const shakeAnimation = new Animated.Value(0);

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
      const res = await createCartItemMutation.mutateAsync({
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
      // After successful enrollment, navigate back or show success message
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

  if (courseLoading) return <ActivityIndicatorScreen />;
  if (courseError)
    return (
      <ErrorScreen message="Failed to load courses. Showing default courses." />
    );

  if (course == null)
    return <ErrorScreen message="Failed to load courses. Course is null." />;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}

      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/(tabs)/course/course")}
            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="flex-row items-center">
            <CartButton bgColor="bg-black/30" iconColor="white" />
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2"
              onPress={() => router.push("/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
            </Pressable>
          </View>
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
              Thời lượng: {course.durationsDisplay}
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

          {selectedTab === "overview" && course && course.chapters && (
            <View>
              <Text className="text-lg font-bold mb-3">Nội dung khóa học</Text>
              {course.chapters.map((chapter) => (
                <View
                  key={chapter.id}
                  className="bg-white rounded-xl border border-gray-100 mb-4"
                >
                  <View className="p-4">
                    <Text className="font-bold text-base">{chapter.title}</Text>
                    <Text
                      className="text-gray-600 mt-1"
                      numberOfLines={2}
                      style={{ flexWrap: "wrap" }}
                    >
                      {chapter.description}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <MaterialIcons
                        name="schedule"
                        size={16}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 ml-1">
                        {chapter.durationsDisplay}
                      </Text>
                      <Text className="text-gray-400 mx-2">•</Text>
                      <Text className="text-gray-600">
                        {chapter.lessons.length} bài học
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

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
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-gray-500 text-sm mb-1">Học phí</Text>
            <Text className="text-2xl font-bold text-blue-500">
              {course.price === 0
                ? "Miễn phí"
                : `${course.price.toLocaleString("vi-VN")} ₫`}
            </Text>
          </View>

          {course.price > 0 && (
            <View>
              <Text className="text-gray-500 text-sm mb-2 text-center">
                Số lượng
              </Text>
              <View className="flex-row items-center">
                <Pressable
                  className="w-9 h-9 items-center justify-center rounded-lg bg-gray-100"
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
                  className="w-9 h-9 items-center justify-center rounded-lg bg-gray-100"
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
          className={`py-4 bg-blue-500 rounded-xl items-center ${
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
          {course.price === 0 ? (
            enrollFreeMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Đăng ký khóa học
              </Text>
            )
          ) : createCartItemMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Thêm vào giỏ hàng •{" "}
              {(course.price * quantity).toLocaleString("vi-VN")} ₫
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
