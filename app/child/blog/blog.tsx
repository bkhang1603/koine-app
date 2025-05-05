import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useBlog } from "@/queries/useBlog";
import { useAppStore } from "@/components/app-provider";
import { blogRes, GetAllBlogResType } from "@/schema/blog-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const BLOG_CATEGORIES = ["Tất cả", "Tâm lý", "Sức khỏe", "Kỹ năng", "Giáo dục"];

// Menu options for more menu
const MENU_OPTIONS = [
  {
    id: "home",
    title: "Trang chủ",
    icon: "home",
    route: "/child/(tabs)/home",
  },
  {
    id: "courses",
    title: "Khóa học",
    icon: "menu-book",
    route: "/child/(tabs)/course",
  },
  {
    id: "my-courses",
    title: "Khóa học của tôi",
    icon: "school",
    route: "/child/(tabs)/my-courses",
  },
  {
    id: "games",
    title: "Trò chơi",
    icon: "sports-esports",
    route: "/child/(tabs)/games",
  },
  {
    id: "profile",
    title: "Hồ sơ",
    icon: "person",
    route: "/child/(tabs)/profile",
  },
];

export default function ChildBlogScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken?.accessToken;
  const profile = useAppStore((state) => state.profile);
  const insets = useSafeAreaInsets();
  const [showMenu, setShowMenu] = useState(false);

  const notificationBadge = useAppStore((state) => state.notificationBadge);
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

  if (blogLoading) {
    console.log("Loading blog child");
  }
  if (blogError) {
    console.log("Lỗi blog child");
  }

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
    <View className="flex-1 bg-gray-50">
      {/* Top SafeArea */}
      <View className="bg-violet-500">
        <SafeAreaView edges={["top"]} className="bg-violet-500" />
      </View>

      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section - Match child UI style */}
        <View className="pt-4 pb-8 px-5 bg-violet-500">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center mr-2"
                onPress={() => router.back()}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </Pressable>
              <View>
                <Text className="text-white/80 text-sm font-medium">
                  Khám phá
                </Text>
                <Text className="text-white text-xl font-bold">
                  Bài viết của Koine
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <Pressable
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                onPress={() => router.push("/child/notifications")}
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
              <Pressable
                className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
                onPress={() => setShowMenu(true)}
              >
                <MaterialIcons name="more-vert" size={22} color="white" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Main Content with rounded top corners */}
        <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-6">
          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2 pl-5"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {BLOG_CATEGORIES.map((category, index) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl mr-2 ${
                  selectedCategory === category
                    ? "bg-violet-500"
                    : "bg-white border border-gray-200"
                } ${index === BLOG_CATEGORIES.length - 1 ? "mr-5" : "mr-2"}`}
              >
                <Text
                  className={
                    selectedCategory === category
                      ? "text-white font-medium"
                      : "text-gray-700"
                  }
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Featured Post */}
          {featuredPost && (
            <View className="px-5 mt-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold">Bài viết nổi bật</Text>
                {/* <Pressable
                                    onPress={() => {
                                        
                                    }}
                                >
                                    <Text className="text-violet-500 font-medium">
                                        Xem tất cả
                                    </Text>
                                </Pressable> */}
              </View>
              <Pressable
                className="bg-white rounded-3xl overflow-hidden shadow-sm"
                style={{
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                }}
                onPress={() =>
                  router.push(`/child/blog/detail/${featuredPost.id}` as any)
                }
              >
                <View className="relative">
                  {/* Top Section with Image */}
                  <Image
                    source={{ uri: featuredPost.imageUrl }}
                    className="w-full h-48"
                    style={{ resizeMode: "cover" }}
                  />

                  {/* Category badge on image */}
                  {featuredPost.categories.length > 0 && (
                    <View className="absolute top-3 left-3 bg-violet-500/80 backdrop-blur-md rounded-lg px-2.5 py-1">
                      <Text className="text-white text-xs font-medium">
                        {featuredPost.categories[0].name}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Content Section */}
                <View className="p-5">
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
                      <View className="w-8 h-8 rounded-full bg-violet-50 items-center justify-center">
                        <Text className="text-violet-700 font-bold">
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
                    className="mt-4 border border-violet-500 rounded-full py-2.5 flex-row justify-center items-center"
                    onPress={() =>
                      router.push(
                        `/child/blog/detail/${featuredPost.id}` as any
                      )
                    }
                  >
                    <Text className="text-violet-500 font-medium text-sm">
                      Đọc tiếp
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color="#8B5CF6"
                      style={{ marginLeft: 4 }}
                    />
                  </Pressable>
                </View>
              </Pressable>
            </View>
          )}

          {/* Recent Posts */}
          <View className="mt-8">
            <View className="px-5 mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold">Bài viết gần đây</Text>
              {/* <Pressable
                                onPress={() => {
                                    
                                }}
                            >
                                <Text className="text-violet-500 font-medium">
                                    Xem tất cả
                                </Text>
                            </Pressable> */}
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
                  className="bg-white rounded-3xl overflow-hidden mr-4 shadow-sm"
                  style={{
                    width: 260,
                    borderWidth: 1,
                    borderColor: "#f1f5f9",
                  }}
                  onPress={() =>
                    router.push(`/child/blog/detail/${post.id}` as any)
                  }
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
                      <View className="absolute top-3 left-3 bg-violet-500/80 backdrop-blur-md rounded-lg px-2.5 py-1">
                        <Text className="text-white text-xs font-medium">
                          {post.categories[0].name}
                        </Text>
                      </View>
                    )}
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
                        <View className="w-6 h-6 rounded-full bg-violet-50 items-center justify-center">
                          <Text className="text-violet-700 text-xs font-bold">
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
              colors={["#8B5CF6", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl shadow-lg overflow-hidden"
            >
              <Pressable
                className="p-6"
                onPress={() => router.push("/child/blog" as any)}
              >
                <View className="relative">
                  {/* Decorative circles */}
                  <View className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/10" />
                  <View className="absolute -top-14 -right-4 w-16 h-16 rounded-full bg-white/5" />

                  {/* Icon in top corner */}
                  <View className="absolute -top-1 -right-1 w-14 h-14 rounded-full bg-violet-400/30 items-center justify-center">
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
        </View>
      </ScrollView>

      {/* Menu Dropdown */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowMenu(false)}
        >
          <View
            className="absolute top-20 right-4 bg-white rounded-2xl shadow-xl w-64"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {MENU_OPTIONS.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => {
                  setShowMenu(false);
                  router.replace(option.route as any);
                }}
                className={`flex-row items-center p-4 ${
                  index !== MENU_OPTIONS.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <MaterialIcons
                  name={option.icon as any}
                  size={24}
                  color="#8B5CF6"
                />
                <Text className="ml-3 text-gray-700">{option.title}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
