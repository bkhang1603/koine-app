import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { WebView } from "react-native-webview";
import { useBlogDetail } from "@/queries/useBlog";
import { blogDetailRes, GetBlogDetailResType } from "@/schema/blog-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const {
        data: blogData,
        isLoading: blogLoading,
        isError: blogError,
      } = useBlogDetail({
        blogId: id as string,
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
    
      if (blogLoading) return <ActivityIndicatorScreen />;
      if (blogError)
        return (
          <ErrorScreen message="Failed to load blogs. Showing default blogs." />
        );
    
      if (blog == null)
        return <ErrorScreen message="Failed to load blogs. Course is null." />;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Blog" />
            <ScrollView>
                <Image
                    source={{ uri: blog.imageUrl }}
                    className="w-full h-48"
                />
                <View className="p-4">
                    <View className="flex-row items-center">
                        <Text className="text-blue-500 text-sm font-medium">
                            {blog.categories[0].name}
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 text-sm">
                            {blog.createdAtFormatted}
                        </Text>
                    </View>

                    <Text className="text-2xl font-bold mt-2">
                        {blog.title}
                    </Text>

                    <View className="flex-row items-center mt-4">
                        <MaterialIcons
                            name="person"
                            size={16}
                            color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-1">
                            {blog.creatorInfo.firstName}
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500">{blog.createdAtFormatted}</Text>
                    </View>

                    <View className="mt-6">
                        <WebView
                            source={{
                                html: `
                                    <html>
                                        <head>
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                                            <style>
                                                body {
                                                    font-family: -apple-system, system-ui;
                                                    font-size: 16px;
                                                    line-height: 1.6;
                                                    color: #374151;
                                                    padding: 0;
                                                    margin: 0;
                                                }
                                                h1, h2, h3 {
                                                    color: #111827;
                                                    margin-top: 1.5em;
                                                }
                                                p {
                                                    margin-bottom: 1em;
                                                }
                                                img {
                                                    max-width: 100%;
                                                    height: auto;
                                                    border-radius: 8px;
                                                }
                                            </style>
                                        </head>
                                        <body>
                                            ${blog.content || ""}
                                        </body>
                                    </html>
                                `,
                            }}
                            style={{ height: 800 }}
                            scalesPageToFit={false}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
