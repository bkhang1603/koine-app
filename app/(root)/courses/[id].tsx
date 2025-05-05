import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Animated,
  Alert,
  Modal,
} from 'react-native'
import { AntDesign, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CartButton from '@/components/CartButton'
import {
  useCourseDetail,
  useCourseReviews,
  useEnrollFreeCourse,
} from '@/queries/useCourse'
import ActivityIndicatorScreen from '@/components/ActivityIndicatorScreen'
import {
  courseDetailRes,
  GetCourseDetailResType,
  getCourseReviews,
} from '@/schema/course-schema'
import { useCreateCartItemMutation } from '@/queries/useCart'
import { useAppStore } from '@/components/app-provider'
import formatDuration from '@/util/formatDuration'
import { useMyCourse } from '@/queries/useUser'
import { GetMyCoursesResType, myCourseRes } from '@/schema/user-schema'

// Menu options giống như trong HeaderWithBack
const MENU_OPTIONS = [
  {
    id: 'home',
    title: 'Trang chủ',
    icon: 'home',
    route: '/(tabs)/home',
  },
  {
    id: 'courses',
    title: 'Khóa học',
    icon: 'menu-book',
    route: '/(tabs)/course/course',
  },
  {
    id: 'my-courses',
    title: 'Khóa học của tôi',
    icon: 'school',
    route: '/(tabs)/my-courses/my-courses',
  },
  {
    id: 'profile',
    title: 'Tài khoản',
    icon: 'person',
    route: '/(tabs)/profile/profile',
  },
  {
    id: 'blog',
    title: 'Blog',
    icon: 'article',
    route: '/(tabs)/blog/blog',
  },
]

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'content' | 'reviews'
  >('overview')
  const [quantity, setQuantity] = useState(1)
  const shakeAnimation = new Animated.Value(0)
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const accessToken = useAppStore((state) => state.accessToken)
  const token = accessToken == undefined ? '' : accessToken.accessToken

  const {
    data: myCourseReviews,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseReviews({ token, courseId: id as string })

  useFocusEffect(() => {
    refetch()
  })

  let reviews = null
  if (myCourseReviews && !isError) {
    const parsedResult = getCourseReviews.safeParse(myCourseReviews)
    if (parsedResult.success) {
      reviews = parsedResult.data.data
    } else {
      console.error('Validation errors:', parsedResult.error.errors)
    }
  }

  const {
    data: courseData,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourseDetail({
    courseId: id as string,
  })

  const {
    data: myCourseOverviewData,
    isLoading: myCourseOverviewLoading,
    isError: myCourseOverviewError,
    refetch: refetchMyCourse,
  } = useMyCourse({
    token: token as string,
  })

  const createCartItemMutation = useCreateCartItemMutation()
  const enrollFreeMutation = useEnrollFreeCourse()

  let course: GetCourseDetailResType['data'] | null = null

  if (courseData && !courseError) {
    if (courseData.data === null) {
    } else {
      const parsedResult = courseDetailRes.safeParse(courseData)
      if (parsedResult.success) {
        course = parsedResult.data.data
      } else {
        console.error('Validation errors:', parsedResult.error.errors)
      }
    }
  }

  let myCourse: GetMyCoursesResType['data'] = []

  if (myCourseOverviewData && !myCourseOverviewError) {
    if (myCourseOverviewData.data.length === 0) {
    } else {
      const parsedResult = myCourseRes.safeParse(myCourseOverviewData)
      if (parsedResult.success) {
        myCourse = parsedResult.data.data
      } else {
        console.error('Validation errors:', parsedResult.error.errors)
      }
    }
  }

  const isEnrolled = useMemo(() => {
    return myCourse.some((course) => course.id === id)
  }, [myCourse, id])

  const handleAddToCart = async () => {
    if (!token) {
      return
    }

    try {
      await createCartItemMutation.mutateAsync({
        body: {
          courseId: id as string,
          quantity: quantity,
        },
        token,
      })
      Alert.alert('Thông báo', 'Thêm khóa học vào giỏ thành công', [
        {
          text: 'Mua tiếp',
          style: 'cancel',
        },
        {
          text: 'Khóa học của tôi',
          onPress: () => {
            router.push('/(tabs)/my-courses/my-courses')
          },
          style: 'destructive',
        },
      ])
    } catch (error) {
      Alert.alert('Lỗi', `Không thêm được khóa học ${error}`, [
        {
          text: 'tắt',
          style: 'cancel',
        },
      ])
    }
  }

  const handleEnrollFreeCourse = async () => {
    if (!token) {
      return
    }

    try {
      await enrollFreeMutation.mutateAsync({
        token,
        courseId: id as string,
      })
      Alert.alert('Thông báo', 'Đăng kí thành công', [
        {
          text: 'Trang chủ',
          onPress: async () => {
            router.push('/(tabs)/home')
          },
          style: 'cancel',
        },
      ])
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
  }

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev: string[]) =>
      prev.includes(chapterId)
        ? prev.filter((id: string) => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  if (courseLoading) return <ActivityIndicatorScreen />
  if (courseError) console.log('Lỗi khi tải dữ liệu khóa học')
  // return <ErrorScreen message="Lỗi khi tải dữ liệu khóa học" />;

  if (course == null)
    return console.log('Lỗi khi tải dữ liệu khóa học. Không tìm thấy khóa học')
  // <ErrorScreen message="Lỗi khi tải dữ liệu khóa học. Không tìm thấy khóa học" />

  return (
    <View className="flex-1 bg-white">
      {/* Header - Redesigned with gradient background */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="px-4 py-3 flex-row items-center justify-between backdrop-blur-sm">
          <Pressable
            onPress={() => router.push('/(tabs)/course/course')}
            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="flex-row items-center">
            <CartButton bgColor="bg-black/30" iconColor="white" />
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2 mr-2"
              onPress={() => router.push('/(root)/notifications/notifications')}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
            </Pressable>
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-black/30"
              onPress={() => setShowMenu(true)}
            >
              <MaterialIcons name="more-vert" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Course Thumbnail with shadow overlay */}
        <View className="relative">
          <Image source={{ uri: course.imageBanner }} className="w-full h-64" />
          <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        </View>

        {/* Course Info - Redesigned with card style */}
        <View className="p-5 -mt-4 rounded-t-3xl bg-white">
          <Text className="text-2xl font-bold">{course.title}</Text>

          <View className="flex-row items-center justify-between mt-3 bg-blue-50 p-3 rounded-xl">
            <View className="flex-row items-center">
              <MaterialIcons name="star" size={22} color="#FFA000" />
              <Text className="ml-1 font-semibold text-lg">
                {course.aveRating == 0 ? 5 : course.aveRating}
              </Text>
            </View>

            <View className="flex-row items-center">
              <MaterialIcons name="people" size={22} color="#0277BD" />
              <Text className="ml-1 font-medium text-base">
                {course.totalEnrollment} học viên
              </Text>
            </View>

            <View className="flex-row items-center">
              <MaterialIcons name="bar-chart" size={22} color="#7B1FA2" />
              <Text className="ml-1 font-medium text-base">
                {course.level == null
                  ? 'Chưa có cấp độ'
                  : course.level == 'ALL'
                  ? 'Tất cả'
                  : course.level == 'BEGINNER'
                  ? 'Khởi đầu'
                  : course.level == 'INTERMEDIATE'
                  ? 'Trung cấp'
                  : 'Nâng cao'}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row items-center bg-amber-50 p-3 rounded-xl">
            <MaterialIcons name="access-time" size={24} color="#E65100" />
            <Text className="ml-2 text-gray-700 text-base font-medium">
              Thời lượng: {formatDuration(course.durationsDisplay)}
            </Text>
          </View>

          <Text className="text-gray-700 mt-4 text-base leading-6">
            {course.description}
          </Text>
        </View>

        {/* Tabs - Redesigned with pill style */}
        <View className="mx-4 mt-3 mb-1 p-1 flex-row bg-gray-100 rounded-full">
          {(['overview', 'content', 'reviews'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={`flex-1 py-2.5 ${
                selectedTab === tab
                  ? 'bg-white rounded-full shadow-sm'
                  : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedTab === tab ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {tab === 'overview'
                  ? 'Tổng quan'
                  : tab === 'content'
                  ? 'Nội dung'
                  : 'Đánh giá'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content - Redesigned with better spacing */}
        <View className="p-4 mt-2">
          {selectedTab === 'overview' && course && course.chapters && (
            <View>
              <Text className="text-xl font-bold mb-4">
                Bạn sẽ học được gì?
              </Text>
              <View className="space-y-3">
                {course.chapters.map((chapter) => (
                  <View key={chapter.id} className="flex-row items-start">
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color="#10B981"
                      style={{ marginTop: 2 }}
                    />
                    <Text className="ml-3 text-gray-700 text-base flex-1">
                      {chapter.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTab === 'content' && course && course.chapters && (
            <View>
              <Text className="text-xl font-bold mb-4">Nội dung khóa học</Text>
              {course.chapters.map((chapter, chapterIndex) => (
                <View
                  key={chapter.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
                >
                  <Pressable
                    onPress={() => toggleChapter(chapter.id)}
                    className="px-4 py-4 bg-gray-50"
                  >
                    <View className="flex-row items-center">
                      <View className="w-9 h-9 bg-blue-600 rounded-full items-center justify-center mr-3">
                        <Text className="text-white font-bold">
                          {chapterIndex + 1}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text
                            numberOfLines={1}
                            className="font-bold text-gray-800 text-sm flex-1"
                          >
                            {chapter.title}
                          </Text>
                          <MaterialIcons
                            name={
                              expandedChapters.includes(chapter.id)
                                ? 'keyboard-arrow-up'
                                : 'keyboard-arrow-down'
                            }
                            size={28}
                            color="#4B5563"
                          />
                        </View>
                        <View className="flex-row items-center mt-1">
                          <MaterialIcons
                            name="schedule"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-xs ml-1 mr-1">
                            {formatDuration(chapter.durationsDisplay)}
                          </Text>

                          <MaterialIcons
                            name="menu-book"
                            size={16}
                            color="#6B7280"
                          />

                          <Text className="text-gray-500 text-xs ml-1">
                            {chapter.lessons.length + ' bài học'}
                          </Text>

                          {chapter.questions.length != 0 ? (
                            <View className="flex-row justify-center items-center ml-1">
                              <SimpleLineIcons
                                name="note"
                                size={12}
                                color="black"
                              />
                              <Text className="text-gray-500 text-xs ml-1">
                                1 bài kiểm tra
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </Pressable>

                  {expandedChapters.includes(chapter.id) && (
                    <View className="ml-12 border-l border-gray-200">
                      {chapter.lessons.map((lesson, index) => {
                        const isFirstChapterFirstLesson =
                          chapterIndex === 0 && index === 0
                        return (
                          <Pressable
                            key={lesson.id}
                            className={`flex-row items-center px-4 py-3.5 border-b border-gray-300
                              ${
                                !isFirstChapterFirstLesson ? 'opacity-50' : ''
                              }`}
                            disabled={!isFirstChapterFirstLesson}
                            onPress={() => {
                              if (isFirstChapterFirstLesson) {
                                router.push({
                                  pathname: '/(root)/courses/lesson/[lessonId]',
                                  params: {
                                    lessonId: lesson.id,
                                    courseId: id,
                                    lessonData: JSON.stringify(lesson),
                                  },
                                })
                              }
                            }}
                          >
                            <View className="w-8 items-center mr-3">
                              <MaterialIcons
                                name={
                                  isFirstChapterFirstLesson
                                    ? 'play-circle-fill'
                                    : 'lock'
                                }
                                size={22}
                                color={
                                  isFirstChapterFirstLesson
                                    ? '#2563EB'
                                    : '#9CA3AF'
                                }
                              />
                            </View>
                            <View className="flex-1">
                              <Text
                                className={`font-medium ${
                                  isFirstChapterFirstLesson
                                    ? 'text-gray-800'
                                    : 'text-gray-400'
                                }`}
                              >
                                {lesson.title}
                              </Text>
                              <View className="flex-row items-center mt-1">
                                <MaterialIcons
                                  name={
                                    lesson.type === 'VIDEO'
                                      ? 'videocam'
                                      : 'article'
                                  }
                                  size={14}
                                  color="#6B7280"
                                />
                                <Text className="text-gray-500 text-sm ml-1">
                                  {lesson.durationsDisplay}
                                </Text>
                              </View>
                            </View>
                            {isFirstChapterFirstLesson && (
                              <MaterialIcons
                                name="chevron-right"
                                size={20}
                                color="#6B7280"
                              />
                            )}
                          </Pressable>
                        )
                      })}
                    </View>
                  )}
                  {expandedChapters.includes(chapter.id) &&
                    chapter.questions.length != 0 && (
                      <View className="ml-12 border-l border-gray-200">
                        <View
                          className={`flex-row items-center px-4 py-3.5 border-t border-gray-300
                              opacity-50
                              `}
                        >
                          <View className="w-8 items-center mr-3">
                            <MaterialIcons
                              name={'lock'}
                              size={22}
                              color={'#9CA3AF'}
                            />
                          </View>
                          <View className="flex-1">
                            <Text
                              className={`font-medium text-gray-400
                                
                                }`}
                            >
                              Bài kiểm tra chương
                            </Text>
                            <View className="flex-row items-center mt-1">
                              <AntDesign
                                name="questioncircle"
                                size={14}
                                color="#9CA3AF"
                              />
                              <Text className="text-gray-500 text-sm ml-1">
                                {chapter.questions.length} câu hỏi
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                </View>
              ))}
            </View>
          )}

          {selectedTab === 'reviews' && (
            <View className="space-y-6">
              {/* Rating Summary */}
              {reviews && (
                <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="items-center">
                      <Text className="text-4xl font-bold text-gray-900">
                        {reviews.stars.averageRating.toFixed(1)}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <MaterialIcons
                            key={star}
                            name="star"
                            size={16}
                            color={
                              star <= reviews.stars.averageRating
                                ? '#F59E0B'
                                : '#E5E7EB'
                            }
                            style={{ marginHorizontal: 1 }}
                          />
                        ))}
                      </View>
                      <Text className="text-gray-500 text-sm mt-1">
                        {reviews.stars.totalRating} đánh giá
                      </Text>
                    </View>
                    <View className="flex-1 ml-8">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <View
                          key={rating}
                          className="flex-row items-center mb-1"
                        >
                          <Text className="text-gray-600 text-sm w-6">
                            {rating}
                          </Text>
                          <View className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                            <View
                              className="h-2 bg-yellow-500 rounded-full"
                              style={{
                                width: `${
                                  (reviews.stars.ratings[
                                    rating as keyof typeof reviews.stars.ratings
                                  ] /
                                    reviews.stars.totalRating) *
                                  100
                                }%`,
                              }}
                            />
                          </View>
                          <Text className="text-gray-500 text-sm w-8">
                            {
                              reviews.stars.ratings[
                                rating as keyof typeof reviews.stars.ratings
                              ]
                            }
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {/* Reviews List */}
              {reviews && reviews.ratingInfos.length > 0 ? (
                <View className="space-y-4">
                  {reviews.ratingInfos.map((review, index) => (
                    <View
                      key={index}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                            <Text className="text-blue-600 font-semibold">
                              {review.user.username.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View className="ml-3">
                            <Text className="font-semibold text-gray-900">
                              {review.user.username}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                              {review.createdAtFormatted}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row items-center">
                          <MaterialIcons
                            name="star"
                            size={16}
                            color="#F59E0B"
                          />
                          <Text className="ml-1 font-semibold text-gray-900">
                            {review.rating}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-gray-700">{review.review}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 items-center justify-center py-12">
                  <MaterialIcons name="star-border" size={48} color="#9CA3AF" />
                  <Text className="text-center text-gray-500 mt-3 text-base">
                    Chưa có đánh giá nào cho khóa học này
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action - Redesigned with cleaner layout */}
      <View
        className="bg-white border-t border-gray-100 px-6 py-4 shadow-lg"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        {isEnrolled && course.price == 0 ? (
          <View className="flex-row h-[56px] rounded-xl justify-center items-center mb-4 bg-green-500">
            <MaterialIcons
              name="school"
              size={20}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white font-bold text-base">Đã đăng kí</Text>
          </View>
        ) : (
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-gray-500 text-sm mb-1">Học phí</Text>
                <Text className="text-2xl font-bold text-blue-600">
                  {course.price === 0
                    ? 'Miễn phí'
                    : `${course.price.toLocaleString('vi-VN')} ₫`}
                </Text>
              </View>

              {course.price > 0 && (
                <View className="bg-gray-50 px-3 py-2 rounded-lg">
                  <Text className="text-gray-500 text-xs mb-2 text-center">
                    Số lượng
                  </Text>
                  <View className="flex-row items-center">
                    <Pressable
                      className="w-8 h-8 items-center justify-center rounded-lg bg-gray-200"
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <MaterialIcons
                        name="remove"
                        size={20}
                        color={quantity <= 1 ? '#9CA3AF' : '#374151'}
                      />
                    </Pressable>
                    <Animated.Text
                      className="mx-4 font-semibold text-lg"
                      style={{
                        transform: [
                          {
                            translateX: shakeAnimation,
                          },
                        ],
                      }}
                    >
                      {quantity}
                    </Animated.Text>
                    <Pressable
                      className="w-8 h-8 items-center justify-center rounded-lg bg-gray-200"
                      onPress={() => {
                        if (quantity >= 3) {
                          shake()
                        } else {
                          setQuantity(quantity + 1)
                        }
                      }}
                    >
                      <MaterialIcons
                        name="add"
                        size={20}
                        color={quantity >= 3 ? '#9CA3AF' : '#374151'}
                      />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            <Pressable
              className={`h-[56px] rounded-xl items-center justify-center ${
                course.price === 0 ? 'bg-green-500' : 'bg-blue-600'
              } ${
                (
                  course.price === 0
                    ? enrollFreeMutation.isPending
                    : createCartItemMutation.isPending
                )
                  ? 'opacity-70'
                  : ''
              }`}
              onPress={
                course.price === 0 ? handleEnrollFreeCourse : handleAddToCart
              }
              disabled={
                course.price === 0
                  ? enrollFreeMutation.isPending
                  : createCartItemMutation.isPending
              }
            >
              <View className="flex-row items-center justify-center">
                {course.price === 0 ? (
                  enrollFreeMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <MaterialIcons
                        name="school"
                        size={20}
                        color="white"
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-white font-bold text-base">
                        Đăng ký khóa học
                      </Text>
                    </>
                  )
                ) : createCartItemMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <MaterialIcons
                      name="shopping-cart"
                      size={20}
                      color="white"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-white font-bold text-base">
                      Thêm vào giỏ hàng •{' '}
                      {(course.price * quantity).toLocaleString('vi-VN')} ₫
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </View>
        )}
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
            className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl w-64"
            style={{
              shadowColor: '#000',
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
                  setShowMenu(false)
                  router.replace(option.route as any)
                }}
                className={`flex-row items-center p-4 ${
                  index !== MENU_OPTIONS.length - 1
                    ? 'border-b border-gray-100'
                    : ''
                }`}
              >
                <MaterialIcons
                  name={option.icon as any}
                  size={24}
                  color="#374151"
                />
                <Text className="ml-3 text-gray-700">{option.title}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
