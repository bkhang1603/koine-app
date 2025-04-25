import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
    TextInput,
    Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useBlogComments, useBlogDetail } from "@/queries/useBlog";
import {
    blogCommentRes,
    blogDetailRes,
    GetAllBlogCommentsResType,
    GetBlogDetailResType,
} from "@/schema/blog-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import { useAppStore } from "@/components/app-provider";
import { formatTimeAgo } from "@/util/date";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

// Menu options for child
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

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [webViewHeight, setWebViewHeight] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [localTotalReact, setLocalTotalReact] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const insets = useSafeAreaInsets();

    const accessToken = useAppStore((state) => state.accessToken);
    const token = accessToken == undefined ? "" : accessToken.accessToken;

    const {
        data: blogData,
        isLoading: blogLoading,
        isError: blogError,
    } = useBlogDetail({
        blogId: id as string,
        token: token as string,
    });

    const {
        data: commentsData,
        isLoading: commentsLoading,
        isError: commentsError,
    } = useBlogComments({
        blogId: id as string,
        page_size: 100,
        page_index: 1,
    });

    let blog: GetBlogDetailResType["data"] | null = null;

    if (blogData && !blogError) {
        if (blogData.data === null) {
        } else {
            const parsedResult = blogDetailRes.safeParse(blogData);
            if (parsedResult.success) {
                blog = parsedResult.data.data;
            } else {
                console.error("Validation errors:", parsedResult.error.errors);
            }
        }
    }

    let blogComments: GetAllBlogCommentsResType["data"] | null = null;

    if (commentsData && !commentsError) {
        if (commentsData.data === null) {
        } else {
            const parsedResult = blogCommentRes.safeParse(commentsData);
            if (parsedResult.success) {
                blogComments = parsedResult.data.data;
            } else {
                console.error("Validation errors:", parsedResult.error.errors);
            }
        }
    }

    // Initialize local states when blog data is loaded
    useEffect(() => {
        if (blogData?.data) {
            setLocalTotalReact(blogData.data.totalReact);
        }
    }, [blogData?.data]);

    if (blogLoading && commentsLoading) return <ActivityIndicatorScreen />;

    if (blogError) return <ErrorScreen message="Lỗi khi tải bài viết" />;

    if (blog == null) return <ErrorScreen message="Không tìm thấy bài viết" />;

    if (commentsError) return null;

    if (blogComments == null) return null;

    // HTML wrapper for WebView content
    const htmlContent = `
  <html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
          body {
              font-family: -apple-system, system-ui;
              font-size: 16px;
              line-height: 1.8;
              color: #374151;
              padding: 0;
              margin: 0;
              overflow-y: hidden;
          }
          
          h1, h2, h3 {
              color: #111827;
              margin-top: 1.8em;
              margin-bottom: 0.8em;
              font-weight: 600;
          }
          p {
              margin-bottom: 1.2em;
          }
          img {
              max-width: 100%;
              height: auto;
              border-radius: 12px;
              margin: 1.5em 0;
          }
          a {
              color: #8B5CF6;
              text-decoration: none;
          }
          blockquote {
              margin: 1.5em 0;
              padding: 1em 1.5em;
              border-left: 4px solid #8B5CF6;
              background: #f3f4f6;
              border-radius: 4px;
          }
      </style>
      <script>
          window.onload = function() {
              window.ReactNativeWebView.postMessage(
                  Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
              );
          }
      </script>
  </head>
  <body>
      ${blog.content.trim() || ""}
  </body>
</html>
  `;

    return (
        <View className="flex-1 bg-gray-50">
            {/* Top SafeArea */}
            <View className="bg-violet-500">
                <SafeAreaView edges={["top"]} className="bg-violet-500" />
            </View>

            <StatusBar style="light" />

            {/* Header */}
            <View className="pt-4 pb-6 px-5 bg-violet-500">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
                        >
                            <MaterialIcons
                                name="arrow-back"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                        <Text className="text-white text-lg font-bold ml-4">
                            Chi tiết bài viết
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Pressable
                            className="w-10 h-10 items-center justify-center rounded-full bg-violet-400/50 mr-2"
                            onPress={() =>
                                router.push("/child/notifications" as any)
                            }
                        >
                            <MaterialIcons
                                name="notifications"
                                size={22}
                                color="white"
                            />
                        </Pressable>

                        <Pressable
                            className="w-10 h-10 items-center justify-center rounded-full bg-violet-400/50"
                            onPress={() => setShowMenu(true)}
                        >
                            <MaterialIcons
                                name="more-vert"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Main Content with rounded top corners */}
            <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 overflow-hidden">
                <ScrollView className="flex-1">
                    <View>
                        <Image
                            source={{ uri: blog.imageUrl }}
                            className="w-full h-56"
                            resizeMode="cover"
                        />

                        <View className="p-5 mt-4 bg-white rounded-2xl mx-4 shadow-sm">
                            <View className="flex-row flex-wrap items-center mb-4">
                                {blog.categories.map((category, index) => (
                                    <React.Fragment key={category.id || index}>
                                        <Text className="text-violet-600 text-xs font-semibold px-3 py-1.5 bg-violet-50 rounded-full">
                                            {category.name}
                                        </Text>
                                        {index < blog.categories.length - 1 && (
                                            <Text className="text-gray-300 mx-2">
                                                •
                                            </Text>
                                        )}
                                    </React.Fragment>
                                ))}
                            </View>

                            <Text className="text-2xl font-bold text-gray-900 tracking-tight">
                                {blog.title}
                            </Text>

                            <View className="flex-row items-center mt-4 pb-4 border-b border-gray-100 overflow-hidden">
                                <Image
                                    source={{ uri: blog.creatorInfo.avatarUrl }}
                                    className="w-10 h-10 rounded-full"
                                />
                                <View className="ml-3">
                                    <Text className="text-gray-900 font-medium">
                                        {blog.creatorInfo.firstName}
                                    </Text>
                                    <Text className="text-gray-500 text-sm">
                                        {blog.createdAtFormatted}
                                    </Text>
                                </View>
                            </View>

                            <View className="mt-4">
                                <WebView
                                    source={{ html: htmlContent }}
                                    style={{ height: webViewHeight }}
                                    scrollEnabled={false}
                                    showsVerticalScrollIndicator={false}
                                    scalesPageToFit={false}
                                    onMessage={(event) => {
                                        setWebViewHeight(
                                            parseInt(event.nativeEvent.data)
                                        );
                                    }}
                                />
                            </View>
                        </View>

                        {/* Article Info */}
                        <View className="bg-white rounded-2xl mx-4 mt-4 p-4 mb-16 shadow-sm">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="comment"
                                        size={20}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-500 ml-2">
                                        {blog.totalComment || 0} bình luận
                                    </Text>
                                </View>

                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="favorite"
                                        size={20}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-500 ml-2">
                                        {localTotalReact || 0} thích
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>

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
                                <Text className="ml-3 text-gray-700">
                                    {option.title}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
