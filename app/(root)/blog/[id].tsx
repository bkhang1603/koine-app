import React, { useState } from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import HeaderWithBack from '@/components/HeaderWithBack'
import { WebView } from 'react-native-webview'
import { useBlogDetail } from '@/queries/useBlog'
import { blogDetailRes, GetBlogDetailResType } from '@/schema/blog-schema'
import ActivityIndicatorScreen from '@/components/ActivityIndicatorScreen'
import ErrorScreen from '@/components/ErrorScreen'

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [webViewHeight, setWebViewHeight] = useState(0)

  const {
    data: blogData,
    isLoading: blogLoading,
    isError: blogError,
  } = useBlogDetail({
    blogId: id as string,
  })

  let blog: GetBlogDetailResType['data'] | null = null

  if (blogData && !blogError) {
    if (blogData.data === null) {
    } else {
      const parsedResult = blogDetailRes.safeParse(blogData)
      if (parsedResult.success) {
        blog = parsedResult.data.data
      } else {
        console.error('Validation errors:', parsedResult.error.errors)
      }
    }
  }

  if (blogLoading) return <ActivityIndicatorScreen />
  if (blogError)
    return (
      <ErrorScreen message="Failed to load blogs. Showing default blogs." />
    )

  if (blog == null)
    return <ErrorScreen message="Failed to load blogs. Course is null." />

  return (
    <View className="flex-1 bg-gray-50">
      <HeaderWithBack title="Blog" />
      <ScrollView bounces={false} className="flex-1">
        <Image
          source={{ uri: blog.imageUrl }}
          className="w-full h-56"
          resizeMode="cover"
        />
        <View className="p-5 -mt-6 bg-white rounded-t-3xl">
          <View className="flex-row flex-wrap items-center mb-4">
            {blog.categories.map((category, index) => (
              <React.Fragment key={category.id || index}>
                <Text className="text-blue-600 text-xs font-semibold px-3 py-1.5 bg-blue-50 rounded-full">
                  {category.name}
                </Text>
                {index < blog.categories.length - 1 && (
                  <Text className="text-gray-300 mx-2">•</Text>
                )}
              </React.Fragment>
            ))}
          </View>

          <Text className="text-2xl font-bold text-gray-900 tracking-tight">
            {blog.title}
          </Text>

          <View className="flex-row items-center mt-4 pb-4 border-b border-gray-100">
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
              source={{
                html: `
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
                                  color: #2563eb;
                                  text-decoration: none;
                              }
                              blockquote {
                                  margin: 1.5em 0;
                                  padding: 1em 1.5em;
                                  border-left: 4px solid #2563eb;
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
                          ${blog.content || ''}
                      </body>
                  </html>
                `,
              }}
              style={{ height: webViewHeight }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              scalesPageToFit={false}
              onMessage={(event) => {
                setWebViewHeight(parseInt(event.nativeEvent.data))
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
