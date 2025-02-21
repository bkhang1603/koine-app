import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_BLOG_POSTS } from "@/constants/mock-data";
import { useBlog } from "@/queries/useBlog";
import { useAppStore } from "@/components/app-provider";
import { blogRes, GetAllBlogResType } from "@/schema/blog-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";

const BLOG_CATEGORIES = ["Tất cả", "Tâm lý", "Sức khỏe", "Kỹ năng", "Giáo dục"];

export default function BlogScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const {
    data: blogData,
    isLoading: blogLoading,
    isError: blogError,
  } = useBlog({
    keyword: "",
    page_size: 10,
    page_index: 1,
    token: token,
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
  if (blogError)
    return (
      <ErrorScreen message="Failed to load courses. Showing default courses." />
    );

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const featuredPost = blog[0]
  const recentPosts = blog

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <SafeAreaView>
        {/* Header */}
        <View className="px-4">
          <Text className="text-2xl font-bold">Blog</Text>
          <Text className="text-gray-600 mt-1">
            Kiến thức hữu ích cho teen và phụ huynh
          </Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 pl-4"
        >
          {BLOG_CATEGORIES.map((category) => (
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

        {/* Featured Post */}
        {featuredPost && (
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
              onPress={() => router.push(`/blog/${featuredPost.id}` as any)}
            >
              <Image
                source={{ uri: featuredPost.imageUrl }}
                className="w-full h-48"
              />
              <View className="p-4">
                <View className="flex-row items-center">
                  <Text className="text-blue-500 text-sm font-medium">
                    {featuredPost.categories[0].name}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500 text-sm">
                    {featuredPost.totalReact}
                  </Text>
                </View>
                <Text className="text-lg font-bold mt-2">
                  {featuredPost.title}
                </Text>
                <Text className="text-gray-600 mt-1" numberOfLines={2}>
                  {featuredPost.description}
                </Text>
                <View className="flex-row items-center mt-3">
                  <MaterialIcons name="person" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    {featuredPost.creatorInfo.firstName}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500">{featuredPost.createdAtFormatted}</Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Recent Posts */}
        <View className="p-4">
          <Text className="text-lg font-bold mb-3">Bài viết mới</Text>
          {recentPosts.map((post) => (
            <Pressable
              key={post.id}
              className="bg-white rounded-2xl mb-4 overflow-hidden flex-row"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => router.push(`/blog/${post.id}` as any)}
            >
              <Image source={{ uri: post.imageUrl }} className="w-24 h-24" />
              <View className="flex-1 p-3">
                <View className="flex-row items-center">
                  <Text className="text-blue-500 text-xs font-medium">         
                    {post.categories[0].name}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500 text-xs">{post.totalReact}</Text>
                </View>
                <Text className="font-bold mt-1" numberOfLines={2}>
                  {post.title}
                </Text>
                <View className="flex-row items-center mt-2">
                  <MaterialIcons name="person" size={14} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1">
                    {post.creatorInfo.firstName}
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
