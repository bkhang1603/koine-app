import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/components/app-provider";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { GetMyCoursesResType, myCourseRes } from "@/schema/user-schema";
import { useMyCourse } from "@/queries/useUser";
import CartButton from "@/components/CartButton";
import { useFocusEffect } from "expo-router";
import formatDuration from "@/util/formatDuration";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const STATUS_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "PROCESSING", label: "Đang học" },
  { id: "PENDING", label: "Chưa học" },
  { id: "COMPLETED", label: "Hoàn thành" },
] as const;

export default function MyCoursesScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "COMPLETED" | "PROCESSING" | "PENDING"
  >("all");

  const notificationBadge = useAppStore((state) => state.notificationBadge);
  const {
    data: myCourseData,
    isLoading: myCourseLoading,
    isError: myCourseError,
    refetch,
  } = useMyCourse({
    token: token as string,
    page_index: 1,
    page_size: 100,
  });

  const profile = useAppStore((state) => state.profile);
  const firstName = profile?.data.firstName || "User";

  useFocusEffect(() => {
    refetch();
  });

  let myCourse: GetMyCoursesResType["data"] = [];

  if (myCourseData && !myCourseError) {
    if (myCourseData.data.length === 0) {
    } else {
      const parsedResult = myCourseRes.safeParse(myCourseData);
      if (parsedResult.success) {
        myCourse = parsedResult.data.data.filter((course) => course.isVisible == true);
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (myCourseLoading) console.log("Tải ở my-course cha")
  if (myCourseError) console.log("Lỗi khi tải dữ liệu khóa học")

  if (myCourse.length == 0) {
    return (
      <View className="flex-1 bg-[#f5f7f9]">
        <StatusBar style="dark" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section - Modern Gradient */}
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="pt-14 pb-8 px-5"
          >
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
                  <Text className="text-white text-lg font-bold">
                    <Image
                      source={{
                        uri: profile?.data.avatarUrl,
                      }}
                      className="w-16 h-16 rounded-full"
                    />
                  </Text>
                </View>
                <View>
                  <Text className="text-white/80 text-sm font-medium">
                    Khoá học
                  </Text>
                  <Text className="text-white text-lg font-bold">
                    Khóa học của tôi
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <View className="mr-2">
                  <CartButton bgColor="bg-white/20" iconColor="white" />
                </View>
                <Pressable
                  className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                  onPress={() =>
                    router.push("/(root)/notifications/notifications")
                  }
                >
                  <MaterialIcons name="notifications" size={26} color="white" />
                  {/* Rating Badge */}
                  {notificationBadge && notificationBadge != 0 ? (
                    <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                      <Text className="text-white text-xs font-bold">
                        {notificationBadge > 9 ? "9+" : notificationBadge}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </Pressable>
              </View>
            </View>
          </LinearGradient>

          <View className="flex-1 items-center justify-center p-4 mt-8">
            <MaterialIcons name="school" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              Bạn chưa đăng kí khóa học nào?
            </Text>
            <Pressable
              className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
              onPress={() => router.push("/(tabs)/home")}
            >
              <Text className="text-white font-bold">Mua/Đăng kí ngay!</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  const filteredCourses = myCourse.filter((course) => {
    // Quy đổi completionRate thành trạng thái
    let courseStatus = "PENDING"; // Mặc định là PENDING
    if (course.completionRate === null || course.completionRate === 0) {
      courseStatus = "PENDING";
    } else if (course.completionRate >= 1 && course.completionRate <= 99) {
      courseStatus = "PROCESSING";
    } else if (course.completionRate === 100) {
      courseStatus = "COMPLETED";
    }

    // Kiểm tra điều kiện lọc
    return selectedStatus === "all" || courseStatus === selectedStatus;
  });

  return (
    <View className="flex-1 bg-[#f5f7f9]">
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section - Modern Gradient */}
        <LinearGradient
          colors={["#3b82f6", "#1d4ed8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-14 pb-8 px-5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
                <Image
                  source={{
                    uri: profile?.data.avatarUrl,
                  }}
                  className="w-16 h-16 rounded-full"
                />
              </View>
              <View>
                <Text className="text-white/80 text-sm font-medium">
                  Khoá học
                </Text>
                <Text className="text-white text-lg font-bold">
                  Khóa học của tôi
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="mr-2">
                <CartButton bgColor="bg-white/20" iconColor="white" />
              </View>
              <Pressable
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                onPress={() =>
                  router.push("/(root)/notifications/notifications")
                }
              >
                <MaterialIcons name="notifications" size={26} color="white" />
                {/* Rating Badge */}
                {notificationBadge && notificationBadge != 0 ? (
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {notificationBadge > 9 ? "9+" : notificationBadge}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </Pressable>
            </View>
          </View>
          {/* <Pressable
                        className="flex-row items-center bg-white/20 rounded-xl p-3.5 mt-2"
                        onPress={() => router.push("/search/searchCourse")}
                    >
                        <MaterialIcons name="search" size={20} color="white" />
                        <Text className="ml-2 text-white/80 flex-1">
                            Tìm kiếm khóa học...
                        </Text>
                    </Pressable> */}
        </LinearGradient>

        {/* filter */}
        <ScrollView
          className="px-4 pt-6"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {STATUS_FILTERS.map((filter) => (
            <Pressable
              key={filter.id}
              className={`px-4 py-2 rounded-xl mr-2 ${
                selectedStatus === filter.id
                  ? "bg-blue-500"
                  : "bg-white border border-gray-200"
              }`}
              onPress={() => setSelectedStatus(filter.id)}
            >
              <Text
                className={
                  selectedStatus === filter.id
                    ? "text-white font-medium"
                    : "text-gray-600"
                }
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="px-4 pt-6">
          {filteredCourses.map((course) => {
            return (
              <View
                key={course.id}
                className="bg-white rounded-2xl mb-6 border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Course Thumbnail */}
                <Image
                  source={{ uri: course.imageUrl }}
                  className="w-full h-40"
                  resizeMode="cover"
                />

                {/* Course Info */}
                <View className="p-4">
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
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-bold text-lg">{course.title}</Text>
                      <Text className="text-gray-600 mt-1">
                        {course.description.length > 50
                          ? course.description.substring(0, 100) + "..."
                          : course.description}
                      </Text>
                    </View>
                  </View>

                  {/* Course Details */}
                  <View className="mt-4 ">
                    <Text className="text-gray-600">
                      Thời gian học:{" "}
                      {formatDuration(course.totalLearningTimeDisplay)}
                    </Text>
                  </View>
                  <Text className="text-gray-600">
                    Tác giả: {course.author}
                  </Text>

                  {/* Progress Bar */}
                  <View className="mt-4">
                    <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <View
                        className={`h-full rounded-full ${
                          course.completionRate === 100
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.max(2, course.completionRate || 0)}%`,
                          opacity: course.completionRate === 0 ? 0.5 : 1,
                        }}
                      />
                    </View>
                    <Text className="text-gray-600 mt-2">
                      {course.completionRate || 0}% hoàn thành
                    </Text>
                  </View>

                  {/* Continue Button */}
                  <Pressable
                    className="bg-blue-500 p-3 rounded-xl mt-4 flex-row items-center justify-center"
                    onPress={() =>
                      router.push({
                        pathname: "/learn/course/[courseId]" as any,
                        params: { courseId: course.id },
                      })
                    }
                  >
                    <Text className="text-white font-bold">
                      {course.completionRate == null ||
                      course.completionRate == 0
                        ? "Bắt đầu học"
                        : "Tiếp tục học"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
        <View className="h-20"></View>
      </ScrollView>
    </View>
  );
}
