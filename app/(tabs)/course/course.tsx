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

        {/* Featured Course */}
        {courses && (
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold mb-3">Nổi bật</Text>
            <Pressable
            
              onPress={() => router.push("/custom-course/custom-course")}
              
              className="bg-blue-500 rounded-xl"
            >
              <Text className="text-white p-2">+ Khóa học tùy chỉnh</Text>
            </Pressable>
          </View>
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
                <View className="flex-row flex-wrap gap-2">
                  {!courses[0].categories.length ? (
                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                      <Text className="text-blue-600 text-xs font-medium">
                        --
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row flex-wrap gap-1">
                      {courses[0].categories.slice(0, 4).map((category) => (
                        <View
                          key={category.id}
                          className="bg-blue-50 px-3 py-1 rounded-full"
                        >
                          <Text className="text-blue-600 text-xs font-medium">
                            {category.name}
                          </Text>
                        </View>
                      ))}
                      {courses[0].categories.length > 4 && (
                        <View className="bg-blue-50 px-3 py-1 rounded-full">
                          <Text className="text-blue-600 text-xs font-medium">
                            ...
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                <Text className="text-lg font-bold mt-2">
                  {courses[0].title}
                </Text>
                <Text className="text-gray-600 mt-1" numberOfLines={2}>
                  {courses[0].description}
                </Text>
                <View className="flex-row items-center mt-3">
                  <MaterialIcons name="schedule" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    {(() => {
                      const duration = courses[0].durationsDisplay;
                      const hours = parseInt(duration.split("h")[0]) || 0;
                      const minutes =
                        parseInt(duration.split("h")[1].replace("p", "")) || 0;
                      let total = "";
                      if (hours > 0) {
                        total += `${hours} giờ `;
                      }
                      if (minutes > 0 || total === "") {
                        total += `${minutes} phút`;
                      }
                      if (total === "") total = "0 phút";
                      return `${total}`;
                    })()}
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
                      courses[0].price === 0
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {courses[0].price !== 0
                      ? courses[0].price.toLocaleString("vi-VN") + " ₫"
                      : "Miễn phí"}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Course List */}
        <View className="px-4">
          <Text className="text-lg font-bold mb-4">Tất cả khóa học</Text>
          {courses.map((course) => (
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
                  pathname: "/courses/[id]",
                  params: { id: course.id },
                })
              }
            >
              <Image
                source={{ uri: course.imageUrl }}
                className="w-32 h-full rounded-l-2xl"
                style={{ resizeMode: "cover" }}
              />
              <View className="flex-1 p-3 justify-between">
                <View>
                  <View className="flex-row items-center mb-1">
                  <View className="flex-row flex-wrap gap-2">
                  {!course.categories.length ? (
                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                      <Text className="text-blue-600 text-xs font-medium">
                        --
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row flex-wrap gap-1">
                      {course.categories.slice(0, 3).map((category) => (
                        <View
                          key={category.id}
                          className="bg-blue-50 px-3 py-1 rounded-full"
                        >
                          <Text className="text-blue-600 text-xs font-medium">
                            {category.name}
                          </Text>
                        </View>
                      ))}
                      {course.categories.length > 3 && (
                        <View className="bg-blue-50 px-3 py-1 rounded-full">
                          <Text className="text-blue-600 text-xs font-medium">
                            ...
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                  </View>
                  <Text className="font-bold text-base" numberOfLines={2}>
                    {course.title.length > 25
                      ? course.title.substring(0, 25) + "..."
                      : course.title}
                  </Text>
                </View>

                <View>
                  <View className="flex-row items-center mt-2">
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="schedule"
                        size={14}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 ml-1 text-xs">
                        {(() => {
                          const duration = course.durationsDisplay;
                          const hours = parseInt(duration.split("h")[0]) || 0;
                          const minutes =
                            parseInt(duration.split("h")[1].replace("p", "")) ||
                            0;
                          let total = "";
                          if (hours > 0) {
                            total += `${hours} giờ`;
                          }
                          if (minutes > 0 || total === "") {
                            total += `${minutes} phút`;
                          }
                          if (total === "") total = "0 phút";
                          return `${total}`;
                        })()}
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
                        <MaterialIcons
                          name="people"
                          size={14}
                          color="#8B5CF6"
                        />
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
          ))}
        </View>
        <View className="h-20"></View>
      </SafeAreaView>
    </ScrollView>
  );
}
