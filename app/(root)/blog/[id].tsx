import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { WebView } from "react-native-webview";
import { MOCK_BLOG_POSTS } from "@/constants/mock-data";

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const post = MOCK_BLOG_POSTS.find((p) => p.id === id);

    if (!post) return null;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Blog" />
            <ScrollView>
                <Image
                    source={{ uri: post.thumbnail }}
                    className="w-full h-48"
                />
                <View className="p-4">
                    <View className="flex-row items-center">
                        <Text className="text-blue-500 text-sm font-medium">
                            {post.category}
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 text-sm">
                            {post.readTime}
                        </Text>
                    </View>

                    <Text className="text-2xl font-bold mt-2">
                        {post.title}
                    </Text>

                    <View className="flex-row items-center mt-4">
                        <MaterialIcons
                            name="person"
                            size={16}
                            color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-1">
                            {post.author}
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500">{post.date}</Text>
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
                                            ${post.content || ""}
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
