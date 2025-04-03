import React, { useState, useMemo } from "react";
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
import formatDuration from "@/util/formatDuration";

export default function CourseScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourses({
    keyword: "",
    page_size: 10,
    page_index: 1,
  });

  const courses = useMemo(() => {
    let result: GetAllCourseResType["data"] = [];
    if (coursesData && !coursesError) {
      if (coursesData.data.length !== 0) {
        const parsedResult = courseRes.safeParse(coursesData);
        if (parsedResult.success) {
          result = parsedResult.data.data;
        } else {
          console.error("Validation errors:", parsedResult.error.errors);
        }
      }
    }
    return result;
  }, [coursesData, coursesError]);

  const featuredCourse = useMemo(() => {
    if (!courses.length) return null;
    return (
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
            pathname: "/child/courses/[id]",
            params: { id: courses[0].id },
          })
        }
      >
        <Image
          source={{
            uri:
              courses[0].imageUrl ??
              "https://thumbs.dreamstime.com/b/orange-cosmos-flower-bud-garden-indiana-39358565.jpg",
          }}
          className="w-full h-48"
          style={{ resizeMode: "cover" }}
        />
        <View className="p-4">
          <View className="flex-row flex-wrap gap-2 mb-1">
            {courses[0].categories.map((category) => (
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
          <Text className="text-lg font-bold mt-2">{courses[0].title}</Text>
          <Text className="text-gray-600 mt-1" numberOfLines={2}>
            {courses[0].description}
          </Text>
          <View className="flex-row items-center mt-3">
            <MaterialIcons name="schedule" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1">
              {formatDuration(courses[0].durationsDisplay)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                <MaterialIcons name="star" size={14} color="#F59E0B" />
                <Text className="ml-1 text-sm font-medium text-yellow-600">
                  {courses[0].aveRating == 0 ? 5 : courses[0].aveRating}
                </Text>
              </View>
              <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full">
                <MaterialIcons name="people" size={14} color="#8B5CF6" />
                <Text className="ml-1 text-sm font-medium text-purple-600">
                  {courses[0].totalEnrollment}
                </Text>
              </View>
            </View>
            <Text
              className={`font-bold ${
                courses[0].price === 0 ? "text-green-500" : "text-blue-500"
              }`}
            >
              {courses[0].price !== 0
                ? courses[0].price.toLocaleString("vi-VN") + " ₫"
                : "Miễn phí"}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }, [courses]);

  const courseList = useMemo(() => {
    return courses.map((course) => (
      <Pressable
        key={course.id}
        className="bg-white rounded-2xl mb-4 overflow-hidden flex-row"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
        onPress={() =>
          router.push({
            pathname: "/child/courses/[id]",
            params: { id: course.id },
          })
        }
      >
        <Image
          source={{
            uri:
              course.imageUrl ??
              "https://thumbs.dreamstime.com/b/orange-cosmos-flower-bud-garden-indiana-39358565.jpg",
          }}
          className="w-32 h-full rounded-l-2xl"
          style={{ resizeMode: "cover" }}
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <View className="flex-row items-center mb-1">
              <View className="flex-row flex-wrap gap-2 mb-1">
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
            </View>
            <Text className="font-bold text-base" numberOfLines={1}>
              {course.title}
            </Text>
          </View>

          <View>
            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={14} color="#6B7280" />
                <Text className="text-gray-600 ml-1 text-xs">
                  {formatDuration(course.durationsDisplay)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center gap-2">
                <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                  <MaterialIcons name="star" size={14} color="#F59E0B" />
                  <Text className="ml-1 text-sm font-medium text-yellow-600">
                    {course.aveRating == 0 ? 5 : course.aveRating}
                  </Text>
                </View>
                <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full">
                  <MaterialIcons name="people" size={14} color="#8B5CF6" />
                  <Text className="ml-1 text-sm font-medium text-purple-600">
                    {course.totalEnrollment}
                  </Text>
                </View>
              </View>
              <Text
                className={`font-bold ${
                  course.price === 0 ? "text-green-500" : "text-blue-500"
                }`}
              >
                {course.price !== 0
                  ? course.price.toLocaleString("vi-VN") + " ₫"
                  : "Miễn phí"}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    ));
  }, [courses]);

  if (coursesLoading) return <ActivityIndicatorScreen />;
  if (coursesError)
    return <ErrorScreen message="Lỗi khi tải dữ liệu khóa học" />;

  return (
    <ScrollView className="flex-1 pt-4 bg-white">
      <SafeAreaView>
        {/* Header */}
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Khóa học</Text>
            <Text className="text-gray-600 mt-1">
              Khám phá nhiều thể loại khóa học
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <Pressable
          className="mx-4 mt-4 flex-row items-center bg-gray-100 rounded-xl p-3"
          onPress={() => router.push("/child/search/searchCourse")}
        >
          <MaterialIcons name="search" size={24} color="#6B7280" />
          <Text className="ml-2 text-gray-500 flex-1">
            Tìm kiếm khóa học...
          </Text>
        </Pressable>

        {/* Featured Course */}
        {courses && (
          <View className="p-4">
            <Text className="text-lg font-bold mb-3">Nổi bật</Text>
            {featuredCourse}
          </View>
        )}

        {/* Course List */}
        <View className="px-4">
          <Text className="text-lg font-bold mb-4">Tất cả khóa học</Text>
          {courseList}
        </View>
        <View className="h-20"></View>
      </SafeAreaView>
    </ScrollView>
  );
}
