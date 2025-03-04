import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import HeaderWithBack from '@/components/HeaderWithBack'
import { WebView } from 'react-native-webview'
import {
  useBlogComments,
  useBlogDetail,
  useCreateBlogComment,
  useCreateBlogReact,
} from '@/queries/useBlog'
import {
  blogCommentRes,
  blogDetailRes,
  GetAllBlogCommentsResType,
  GetBlogDetailResType,
} from '@/schema/blog-schema'
import ActivityIndicatorScreen from '@/components/ActivityIndicatorScreen'
import ErrorScreen from '@/components/ErrorScreen'
import { useAppStore } from '@/components/app-provider'
import { formatTimeAgo } from '@/util/date'
import { useQueryClient } from '@tanstack/react-query'
import course from '@/app/(tabs)/course/course'

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [webViewHeight, setWebViewHeight] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [lastCommentTime, setLastCommentTime] = useState<Date | null>(null)
  const [showValidationMessage, setShowValidationMessage] = useState(false)
  const [localIsReact, setLocalIsReact] = useState(false)
  const [localTotalReact, setLocalTotalReact] = useState(0)
  const [pendingReactUpdate, setPendingReactUpdate] =
    useState<NodeJS.Timeout | null>(null)

  const accessToken = useAppStore((state) => state.accessToken)
  const token = accessToken == undefined ? '' : accessToken.accessToken

  const {
    data: blogData,
    isLoading: blogLoading,
    isError: blogError,
  } = useBlogDetail({
    blogId: id as string,
    token: token as string,
  })

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useBlogComments({
    blogId: id as string,
    page_size: 10,
    page_index: 1,
  })

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateBlogComment({
      token: token as string,
      blogId: id as string,
    })

  const queryClient = useQueryClient()

  const { mutate: createReact, isPending: isCreatingReact } =
    useCreateBlogReact({
      token: token as string,
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

  let blogComments: GetAllBlogCommentsResType['data'] | null = null

  if (commentsData && !commentsError) {
    if (commentsData.data === null) {
    } else {
      const parsedResult = blogCommentRes.safeParse(commentsData)
      if (parsedResult.success) {
        blogComments = parsedResult.data.data
      } else {
        console.error('Validation errors:', parsedResult.error.errors)
      }
    }
  }

  // Initialize local states when blog data is loaded
  useEffect(() => {
    if (blogData?.data) {
      setLocalIsReact(blogData.data.isReact)
      setLocalTotalReact(blogData.data.totalReact)
    }
  }, [blogData?.data])

  if (blogLoading && commentsLoading) return <ActivityIndicatorScreen />

  if (blogError) return null

  if (blog == null) return null

  if (commentsError) return null

  if (blogComments == null) return null

  const canComment = () => {
    if (!commentText.trim() || commentText.trim().length < 2) {
      return false
    }

    if (lastCommentTime) {
      const timeSinceLastComment =
        new Date().getTime() - lastCommentTime.getTime()
      const cooldownPeriod = 10 * 1000
      if (timeSinceLastComment < cooldownPeriod) {
        return false
      }
    }

    return true
  }

  const getRemainingCooldownTime = () => {
    if (!lastCommentTime) return 0
    const timeSinceLastComment =
      new Date().getTime() - lastCommentTime.getTime()
    const cooldownPeriod = 10 * 1000 // 10 seconds
    return Math.max(
      0,
      Math.ceil((cooldownPeriod - timeSinceLastComment) / 1000)
    )
  }

  const handleCommentSubmit = () => {
    setShowValidationMessage(true)

    if (canComment()) {
      createComment(
        {
          identifier: id as string,
          content: commentText.trim(),
        },
        {
          onSuccess: () => {
            setCommentText('')
            setLastCommentTime(new Date())
            setShowValidationMessage(false)
          },
          onError: (error) => {
            console.error('Failed to post comment:', error)
          },
        }
      )
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <HeaderWithBack
        title={
          blog.title.length > 30
            ? blog.title.substring(0, 30) + '...'
            : blog.title
        }
        returnTab="/(tabs)/blog/blog"
      />
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

      {/* Interaction Toolbar */}
      <View className="h-[70px] bg-white border-t border-gray-100 px-6 flex-row items-center justify-center space-x-12">
        <TouchableOpacity
          className="flex-row items-center justify-center"
          disabled={isCreatingReact}
          onPress={() => {
            // Update local state immediately
            setLocalIsReact(!localIsReact)
            setLocalTotalReact((prev) => (!localIsReact ? prev + 1 : prev - 1))

            // Clear any pending update
            if (pendingReactUpdate) {
              clearTimeout(pendingReactUpdate)
            }

            // Set new pending update
            const timeoutId = setTimeout(() => {
              createReact(
                {
                  identifier: id as string,
                  isReact: !localIsReact,
                },
                {
                  onError: (error) => {
                    console.error('Failed to update reaction:', error)
                    // Revert local state on error
                    setLocalIsReact(!localIsReact)
                    setLocalTotalReact((prev) =>
                      localIsReact ? prev + 1 : prev - 1
                    )
                  },
                }
              )
            }, 3000)

            setPendingReactUpdate(timeoutId)
          }}
        >
          <MaterialIcons
            name={localIsReact ? 'favorite' : 'favorite-border'}
            size={28}
            color={localIsReact ? '#E0245E' : '#657786'}
          />
          <Text className="ml-2 text-base font-medium text-gray-700">
            {localTotalReact} Tương tác
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={() => setShowComments(true)}
        >
          <MaterialIcons name="chat-bubble-outline" size={28} color="#657786" />
          <Text className="ml-2 text-base font-medium text-gray-700">
            {blog.totalComment} Bình luận
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="h-[80px] border-b border-gray-200 px-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold">Bình luận</Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <MaterialIcons name="close" size={24} color="#657786" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4">
            {blogComments.commentsWithReplies?.map((comment) => (
              <View key={comment.id} className="py-4 border-b border-gray-100">
                <View className="flex-row">
                  <Image
                    source={{ uri: comment.user.avatarUrl }}
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold">
                      {comment.user.firstName}
                    </Text>
                    <Text className="text-gray-600 mt-1">
                      {comment.content}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-2">
                      {formatTimeAgo(comment.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="min-h-[80px] border-t border-gray-200 px-4 py-2">
            {/* Validation Messages Container */}
            {showValidationMessage && (
              <View className="mb-2 px-2">
                {lastCommentTime && getRemainingCooldownTime() > 0 ? (
                  <Text className="text-xs text-red-500">
                    Làm ơn chờ {getRemainingCooldownTime()} giây trước khi tiếp
                    tục bình luận
                  </Text>
                ) : (
                  commentText.trim().length < 2 && (
                    <Text className="text-xs text-red-500">
                      Bình luận phải có ít nhất 2 ký tự
                    </Text>
                  )
                )}
              </View>
            )}

            {/* Comment Input Container */}
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2">
              <TextInput
                className="flex-1 py-2 px-2 min-h-[45px] text-lg"
                placeholder="Viết bình luận..."
                value={commentText}
                onChangeText={(text) => {
                  setCommentText(text)
                  if (showValidationMessage && text.trim().length >= 2) {
                    setShowValidationMessage(false)
                  }
                }}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                disabled={isCreatingComment}
                onPress={handleCommentSubmit}
              >
                <MaterialIcons
                  name="send"
                  size={20}
                  color={!isCreatingComment ? '#1DA1F2' : '#657786'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
