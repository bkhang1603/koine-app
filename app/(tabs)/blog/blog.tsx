import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useBlog } from "@/queries/useBlog";
import { useAppStore } from "@/components/app-provider";
import { blogRes, GetAllBlogResType } from "@/schema/blog-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import CartButton from "@/components/CartButton";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const BLOG_CATEGORIES = ["Tất cả", "Tâm lý", "Sức khỏe", "Kỹ năng", "Giáo dục"];

export default function BlogScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken?.accessToken;
  const notificationBadge = useAppStore((state) => state.notificationBadge);
  const profile = useAppStore((state) => state.profile);

  const {
    data: blogData,
    isLoading: blogLoading,
    isError: blogError,
  } = useBlog({
    keyword: "",
    page_size: 100,
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

  if (blogLoading) return <ActivityIndicatorScreen />;
  if (blogError) return <ErrorScreen message="Lỗi khi tải bài viết" />;

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Tìm bài post có content dài nhất để làm featured post
  const featuredPost = blog.reduce((longest, current) => {
    return (current.content?.length || 0) > (longest.content?.length || 0)
      ? current
      : longest;
  }, blog[0]);

  const recentPosts = blog;

  // Lấy initial từ tên người dùng
  const firstName = profile?.data.firstName || "Bạn";
  const firstName_Initial = firstName ? firstName.charAt(0).toUpperCase() : "K";

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
                  Khám phá
                </Text>
                <Text className="text-white text-lg font-bold">
                  Bài viết của Koine
                </Text>
              </View>
            </View>

            <View className="flex-row">
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

        {/* Featured Post */}
        {featuredPost && (
          <View className="px-5 mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold">Bài viết nổi bật</Text>
            </View>
            <Pressable
              className="bg-white rounded-3xl overflow-hidden"
              style={{
                borderWidth: 1,
                borderColor: "#f1f5f9",
              }}
              onPress={() => router.push(`/blog/${featuredPost.id}` as any)}
            >
              <View>
                {/* Top Section with Image */}
                <Image
                  source={{ uri: featuredPost.imageUrl }}
                  className="w-full h-48"
                  style={{ resizeMode: "cover" }}
                />

                {/* Content Section */}
                <View className="p-5">
                  {/* Category */}
                  <View className="flex-row mb-3">
                    {featuredPost.categories.length > 0 && (
                      <View className="bg-blue-50 rounded-lg px-3 py-1.5">
                        <Text className="text-blue-700 text-xs font-medium">
                          {featuredPost.categories[0].name}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Title and Description */}
                  <Text className="text-lg font-bold text-gray-900 mb-2">
                    {featuredPost.title}
                  </Text>
                  <Text
                    className="text-gray-600 mb-4 leading-5"
                    numberOfLines={2}
                  >
                    {featuredPost.description}
                  </Text>

                  {/* Divider */}
                  <View className="h-[1px] bg-gray-100 mb-4" />

                  {/* Author and Date */}
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                        <Text className="text-blue-700 font-bold">
                          {featuredPost.creatorInfo.firstName.charAt(0)}
                        </Text>
                      </View>
                      <View className="ml-2">
                        <Text className="text-gray-800 text-sm font-medium">
                          {featuredPost.creatorInfo.firstName}
                        </Text>
                        <Text className="text-gray-500 text-xs">Tác giả</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="calendar-today"
                        size={16}
                        color="#6B7280"
                      />
                      <Text className="text-gray-500 text-xs ml-1">
                        {featuredPost.createdAtFormatted}
                      </Text>
                    </View>
                  </View>

                  {/* Read More Button */}
                  <Pressable
                    className="mt-4 border border-blue-500 rounded-full py-2.5 flex-row justify-center items-center"
                    onPress={() =>
                      router.push(`/blog/${featuredPost.id}` as any)
                    }
                  >
                    <Text className="text-blue-500 font-medium text-sm">
                      Đọc tiếp
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color="#3b82f6"
                      style={{ marginLeft: 4 }}
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Recent Posts - Kiểu mới hoàn toàn */}
        <View className="mt-8">
          <View className="px-5 mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Bài viết gần đây</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 20,
              paddingRight: 20,
            }}
            className="mb-6"
          >
            {recentPosts.map((post) => (
              <Pressable
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden mr-4"
                style={{
                  width: 260,
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                }}
                onPress={() => router.push(`/blog/${post.id}` as any)}
              >
                {/* Phần hình ảnh */}
                <View className="relative">
                  <Image
                    source={{ uri: post.imageUrl }}
                    className="w-full h-36"
                    style={{ resizeMode: "cover" }}
                  />
                  {/* Overlay để tạo hiệu ứng gradient nhẹ phía dưới */}
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.1)"]}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 40,
                    }}
                  />
                  {post.categories.length > 0 && (
                    <View className="absolute top-3 left-3 bg-blue-500/80 backdrop-blur-md rounded-lg px-2.5 py-1">
                      <Text className="text-white text-xs font-medium">
                        {post.categories[0].name}
                      </Text>
                    </View>
                  )}
                  <View className="absolute -bottom-4 right-4 w-8 h-8 rounded-full bg-white shadow-sm items-center justify-center border border-gray-100">
                    <MaterialIcons
                      name="bookmark-border"
                      size={16}
                      color="#3b82f6"
                    />
                  </View>
                </View>

                {/* Phần nội dung */}
                <View className="p-4">
                  <Text
                    className="font-bold text-gray-900 text-base mb-2"
                    numberOfLines={2}
                  >
                    {post.title}
                  </Text>
                  <Text
                    className="text-gray-500 text-xs mb-3"
                    numberOfLines={2}
                  >
                    {post.description}
                  </Text>

                  {/* Footer với avatar và ngày đăng */}
                  <View className="flex-row items-center justify-between mt-1 pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                      <View className="w-6 h-6 rounded-full bg-blue-50 items-center justify-center">
                        <Text className="text-blue-700 text-xs font-bold">
                          {post.creatorInfo.firstName.charAt(0)}
                        </Text>
                      </View>
                      <Text className="text-gray-700 text-xs font-medium ml-1.5">
                        {post.creatorInfo.firstName}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="schedule"
                        size={12}
                        color="#9ca3af"
                      />
                      <Text className="text-gray-400 text-xs ml-1">
                        {post.createdAtFormatted}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Topics Section */}
        <View className="p-5 mt-2 mb-20">
          <Text className="text-lg font-bold mb-3">Chủ đề đề xuất</Text>
          <LinearGradient
            colors={["#6366f1", "#4f46e5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl shadow-lg overflow-hidden"
          >
            <Pressable
              className="p-6"
              onPress={() => router.push("/(tabs)/blog/blog")}
            >
              <View className="relative">
                {/* Decorative circles */}
                <View className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/10" />
                <View className="absolute -top-14 -right-4 w-16 h-16 rounded-full bg-white/5" />

                {/* Icon in top corner */}
                <View className="absolute -top-1 -right-1 w-14 h-14 rounded-full bg-indigo-400/30 items-center justify-center">
                  <MaterialIcons name="bookmarks" size={24} color="white" />
                </View>

                <Text className="text-white text-xl font-bold mb-2">
                  Khám phá chủ đề
                </Text>
                <Text className="text-white/80 mb-4 w-3/4">
                  Tìm kiếm các bài viết liên quan đến chủ đề bạn quan tâm
                </Text>

                <View className="flex-row">
                  <Pressable className="bg-white/20 px-4 py-2 rounded-lg">
                    <Text className="text-white font-medium">
                      Khám phá ngay
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}
