import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CartButton from "@/components/CartButton";
import { useCourses } from "@/queries/useCourse";
import { courseRes, GetAllCourseResType } from "@/schema/course-schema";
import { useAppStore } from "@/components/app-provider";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";

const CATEGORIES = ["Tất cả", "Sức khỏe", "Tâm lý", "Kỹ năng", "Giáo dục"];

export default function CourseScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourses({
    keyword: "",
    page_size: 10,
    page_index: 1,
    token: token,
  });

  let courses: GetAllCourseResType["data"] = [];

  if (coursesData && !coursesError) {
    if (coursesData.data.length === 0) {
    } else {
      const parsedResult = courseRes.safeParse(coursesData);
      if (parsedResult.success) {
        courses = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (coursesLoading) return <ActivityIndicatorScreen />;
  if (coursesError)
    return (
      <ErrorScreen message="Failed to load courses. Showing default courses." />
    );

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <SafeAreaView>
        {/* Header */}
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Khóa học</Text>
            <Text className="text-gray-600 mt-1">
              Khám phá nhiều thể loại khóa học
            </Text>
          </View>

          <View className="flex-row items-center">
            <CartButton />
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-2"
              onPress={() => router.push("/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="#374151" />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <Pressable
          className="mx-4 mt-4 flex-row items-center bg-gray-100 rounded-xl p-3"
          onPress={() => router.push("/search/search")}
        >
          <MaterialIcons name="search" size={24} color="#6B7280" />
          <Text className="ml-2 text-gray-500 flex-1">
            Tìm kiếm khóa học...
          </Text>
        </Pressable>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 pl-4"
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={
                  selectedCategory === category
                    ? "text-white font-medium"
                    : "text-gray-600"
                }
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured Course */}
        {courses && (
          <View className="p-4">
            <Text className="text-lg font-bold mb-3">Nổi bật</Text>
            <Pressable
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() =>
                router.push({
                  pathname: "/courses/[id]",
                  params: { id: courses[0].id },
                })
              }
            >
              <Image
                source={{ uri: courses[0].imageUrl }}
                className="w-full h-48"
              />
              <View className="p-4">
                <View className="flex-row items-center">
                  <Text className="text-blue-500 text-sm font-medium">
                  {courses[0]?.categories?.[0]?.name || "Tiêu biểu"}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500 text-sm">
                    {courses[0].level}
                  </Text>
                </View>
                <Text className="text-lg font-bold mt-2">
                  {courses[0].title}
                </Text>
                <Text className="text-gray-600 mt-1" numberOfLines={2}>
                  {courses[0].description}
                </Text>
                <View className="flex-row items-center mt-3">
                  <MaterialIcons name="people" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    {courses[0].totalEnrollment} học viên
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <MaterialIcons name="schedule" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    {courses[0].durationsDisplay}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={16} color="#FCD34D" />
                    <Text className="ml-1 font-medium">
                      {courses[0].aveRating}
                    </Text>
                    <Text className="text-gray-600 ml-2">
                      ({courses[0].totalEnrollment} học viên)
                    </Text>
                  </View>
                  <Text className="text-blue-500 font-bold">
                    {courses[0].price.toLocaleString("vi-VN")} ₫
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Course List */}
        <View className="p-4">
          <Text className="text-lg font-bold mb-3">Tất cả khóa học</Text>
          {courses.map((course) => (
            <Pressable
              key={course.id}
              className="bg-white rounded-2xl mb-4 overflow-hidden flex-row"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() =>
                router.push({
                  pathname: "/courses/[id]",
                  params: { id: course.id },
                })
              }
            >
              <Image source={{ uri: course.imageUrl }} className="w-24 h-24" />
              <View className="flex-1 p-3">
                <View className="flex-row items-center">
                  <Text className="text-blue-500 text-xs font-medium">
                  {courses[0]?.categories?.[0]?.name || "Tiêu biểu"}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500 text-xs">{course.level}</Text>
                </View>
                <Text className="font-bold mt-1" numberOfLines={2}>
                  {course.title}
                </Text>
                <View className="flex-row items-center mt-3">
                  <MaterialIcons name="people" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    {course.totalEnrollment} học viên
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <MaterialIcons name="schedule" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">{course.durationsDisplay}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={14} color="#FCD34D" />
                    <Text className="ml-1 text-sm">{course.aveRating}</Text>
                  </View>
                  <Text className="text-blue-500 font-bold">
                    {course.price.toLocaleString("vi-VN")} ₫
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <View className="h-20"></View>
      </SafeAreaView>
    </ScrollView>
  );
}
