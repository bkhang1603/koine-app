import React, { useCallback, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MOCK_MY_COURSES,
} from "@/constants/mock-data";
import CartButton from "@/components/CartButton";
import { useCourses, useMyCourseStore } from "@/queries/useCourse";
import { useAppStore } from "@/components/app-provider";
import { courseRes, GetAllCourseResType } from "@/schema/course-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import { useBlog } from "@/queries/useBlog";
import { blogRes, GetAllBlogResType } from "@/schema/blog-schema";
import { useShippingInfos } from "@/queries/useShippingInfos";
import { useCart } from "@/queries/useCart";
import { useMyChilds, useMyCourse, useUserProfile } from "@/queries/useUser";
import { myCourseRes } from "@/schema/user-schema";
import { GetMyCoursesResType } from "@/schema/user-schema";

export default function HomeScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const profile = useAppStore((state) => state.profile);

  // Gọi API shipping
  const {
    data: shippingData,
    isLoading: isLoadingShipping,
    isError: isErrorShipping,
    refetch: refetchShipping,
  } = useShippingInfos({ token: token ? token : "", enabled: true });

  // Gọi API cart
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isErrorCart,
    refetch: refetchCart,
  } = useCart({ token: token ? token : "", enabled: true });

  const {
    data: childData,
    isLoading: isLoadingChild,
    isError: isErrorChild,
    refetch: refetchChild,
  } = useMyChilds({ token: token ? token : "", enabled: true });

  const {
    data: profileData,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useUserProfile({ token: token ? token : "", enabled: true });

  useEffect(() => {
    refetchShipping();
    refetchChild();
    refetchProfile();
  }, [token]);

  // Refetch data when focused
  useFocusEffect(() => {
    refetchCart();
  });

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
      console.log("No courses found in coursesData");
    } else {
      const parsedResult = courseRes.safeParse(coursesData);
      if (parsedResult.success) {
        courses = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  const {
    data: blogData,
    isLoading: blogLoading,
    isError: blogError,
  } = useBlog({
    keyword: "",
    page_size: 10,
    page_index: 1,
  });

  let blog: GetAllBlogResType["data"] = [];

  if (blogData && !blogError) {
    if (blogData.data.length === 0) {
    } else {
      const parsedResult = blogRes.safeParse(blogData);
      if (parsedResult.success) {
        blog = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (coursesLoading && blogLoading) return <ActivityIndicatorScreen />;

  if (coursesError || blogError)
    return <ErrorScreen message="Failed to load courses." />;

  const featuredCourses = courses;
  const latestBlog = blog[0];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <SafeAreaView>
        {/* Header with Avatar */}
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">
              Xin chào, {profile?.data.firstName}!
            </Text>
            <Text className="text-gray-600 mt-1">Hôm nay bạn muốn học gì?</Text>
          </View>
          {/* Cart and Notifications */}
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
          className="mx-4 mt-6 flex-row items-center bg-gray-100 rounded-xl p-3"
          onPress={() => router.push("/search/search")}
        >
          <MaterialIcons name="search" size={24} color="#6B7280" />
          <Text className="ml-2 text-gray-500 flex-1">
            Tìm kiếm khóa học...
          </Text>
        </Pressable>

        {/* Quick Stats */}
        <View className="flex-row justify-between px-4 mt-6">
          <View className="bg-blue-50 rounded-xl p-4 flex-1 mr-2">
            <View className="bg-blue-500 w-8 h-8 rounded-lg items-center justify-center mb-2">
              <MaterialIcons name="school" size={20} color="#fff" />
            </View>
            <Text className="text-gray-600 text-sm">Khóa học</Text>
            <Text className="font-bold text-lg">{MOCK_MY_COURSES.length}</Text>
          </View>
          <View className="bg-green-50 rounded-xl p-4 flex-1 mx-2">
            <View className="bg-green-500 w-8 h-8 rounded-lg items-center justify-center mb-2">
              <MaterialIcons
                name="assignment-turned-in"
                size={20}
                color="#fff"
              />
            </View>
            <Text className="text-gray-600 text-sm">Hoàn thành</Text>
            <Text className="font-bold text-lg">12</Text>
          </View>
          <View className="bg-purple-50 rounded-xl p-4 flex-1 ml-2">
            <View className="bg-purple-500 w-8 h-8 rounded-lg items-center justify-center mb-2">
              <MaterialIcons name="timer" size={20} color="#fff" />
            </View>
            <Text className="text-gray-600 text-sm">Giờ học</Text>
            <Text className="font-bold text-lg">24h</Text>
          </View>
        </View>

        {/* Featured Courses */}
        <View className="mt-6">
          <View className="px-4 flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">Khóa học nổi bật</Text>
            <Pressable onPress={() => router.push("/course/course")}>
              <Text className="text-blue-500">Xem tất cả</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
          >
            {featuredCourses.map((course) => (
              <Pressable
                key={course.id}
                className="bg-white rounded-xl mr-3 w-64 border border-gray-100"
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
                <Image
                  source={{ uri: course.imageUrl }}
                  className="w-full h-32 rounded-t-xl"
                />
                <View className="p-3">
                  <View className="flex-row items-center flex-wrap">
                    {course.categories && course.categories.length > 0 ? (
                      course.categories.map((category, index) => (
                        <React.Fragment key={category.id}>
                          <View className="self-start bg-cyan-200 p-1 mt-1 rounded">
                            <Text className="text-blue-500 text-xs font-medium">
                              {category.name}
                            </Text>
                          </View>
                          {index < course.categories.length - 1 && (
                            <Text className="text-gray-400 mx-2">•</Text>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <View className="self-start bg-cyan-200 p-1 mt-1 rounded">
                        <Text className="text-blue-500 text-xs font-medium">
                          Tiêu biểu
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-500 text-xs">
                    {course.totalEnrollment} học viên
                  </Text>
                  <Text className="font-bold mt-2" numberOfLines={2}>
                    {course.title}
                  </Text>
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
          </ScrollView>
        </View>

        {/* Latest Blog */}
        {latestBlog && (
          <View className="mt-6 pb-6">
            <Text className="text-lg font-bold px-4 mb-3">Bài viết mới</Text>
            <Link href={`/blog/${latestBlog.id}` as any} asChild>
              <Pressable className="mx-4">
                <Image
                  source={{ uri: latestBlog.imageUrl }}
                  className="w-full h-48 rounded-xl"
                />
                <View className="mt-3">
                  <Text className="font-bold text-lg">{latestBlog.title}</Text>
                  <Text className="text-gray-600 mt-1" numberOfLines={2}>
                    {latestBlog.description}
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>
        )}
        <View className="h-20"></View>
      </SafeAreaView>
    </ScrollView>
  );
}
