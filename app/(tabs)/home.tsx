import React, { useCallback, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MOCK_COURSES,
  MOCK_USER,
  MOCK_BLOG_POSTS,
  MOCK_MY_COURSES,
} from "@/constants/mock-data";
import CartButton from "@/components/CartButton";
import { useAppStore } from "@/components/app-provider";
import { useShippingInfos } from "@/queries/useShippingInfos";
import { useCart } from "@/queries/useCart";
import { useFocusEffect } from '@react-navigation/native'

export default function HomeScreen() {
  const recentCourse = MOCK_MY_COURSES[0];
  const featuredCourses = MOCK_COURSES.filter((course) => course.featured);
  const latestBlog = MOCK_BLOG_POSTS[0];
  
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken?.accessToken ?? "";
 
  // Gọi API shipping
  const {
    data: shippingData,
    isLoading: isLoadingShipping,
    isError: isErrorShipping,
    refetch: refetchShipping
  } = useShippingInfos(
    token  ? { token } : { token: "" }
  );

  // Gọi API cart
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isErrorCart,
    refetch: refetchCart
  } = useCart(
    token ? { token } : { token: "" }
  );

  useEffect(() => {
    console.log(token)
  }, [token])

  // Refetch data when focused
  useFocusEffect(
    useCallback(() => {
      refetchShipping()
      refetchCart()
    }, [refetchShipping, refetchCart])
  )

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <SafeAreaView>
        {/* Header with Avatar */}
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Hi, {MOCK_USER.name}!</Text>
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

        {/* Continue Learning */}
        {recentCourse && (
          <View className="mt-6">
            <View className="px-4 flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold">Tiếp tục học</Text>
              <Pressable onPress={() => router.push("/my-courses/my-courses")}>
                <Text className="text-blue-500">Xem tất cả</Text>
              </Pressable>
            </View>
            <Link href={`/learn/${recentCourse.id}` as any} asChild>
              <Pressable className="bg-white rounded-2xl p-3 mx-4 border border-gray-100">
                <View className="flex-row">
                  <Image
                    source={{
                      uri: recentCourse.thumbnail,
                    }}
                    className="w-20 h-20 rounded-xl"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="font-bold" numberOfLines={2}>
                      {recentCourse.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MaterialIcons
                        name="schedule"
                        size={14}
                        color="#6B7280"
                      />
                      <Text className="text-gray-500 text-sm ml-1">
                        {recentCourse.duration}
                      </Text>
                    </View>
                    {/* Progress Bar */}
                    <View className="mt-2">
                      <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${recentCourse.progress || 0}%`,
                          }}
                        />
                      </View>
                      <Text className="text-gray-500 text-xs mt-1">
                        {recentCourse.progress || 0}% hoàn thành
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Link>
          </View>
        )}

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
                  source={{ uri: course.thumbnail }}
                  className="w-full h-32 rounded-t-xl"
                />
                <View className="p-3">
                  <View className="flex-row items-center">
                    <Text className="text-blue-500 text-xs font-medium">
                      {course.category}
                    </Text>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <Text className="text-gray-500 text-xs">
                      {course.level}
                    </Text>
                  </View>
                  <Text className="font-bold mt-2" numberOfLines={2}>
                    {course.title}
                  </Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <MaterialIcons name="star" size={14} color="#FCD34D" />
                      <Text className="ml-1 text-sm">{course.rating}</Text>
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
                  source={{ uri: latestBlog.thumbnail }}
                  className="w-full h-48 rounded-xl"
                />
                <View className="mt-3">
                  <Text className="font-bold text-lg">{latestBlog.title}</Text>
                  <Text className="text-gray-600 mt-1" numberOfLines={2}>
                    {latestBlog.excerpt}
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
