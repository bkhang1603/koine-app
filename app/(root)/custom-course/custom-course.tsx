import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { useAppStore } from "@/components/app-provider";
import { useCourseElement, useCreateCustomCourse } from "@/queries/useCourse";
import { CourseElementResType } from "@/schema/course-schema";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { View, Text } from "react-native";
import { IconButton, Modal, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

// Define extended chapter type with course info
type ChapterType = CourseElementResType["data"][0]["chapters"][0];
interface ChapterWithCourse {
  id: string;
  title: string;
  totalLesson: number;
  description: string;
  lessons: {
    id: string;
    title: string;
    type: string;
    description: string;
  }[];
  courseName: string;
  courseId: string;
}

// Define grouped chapters type
interface GroupedChapters {
  [key: string]: {
    courseName: string;
    chapters: ChapterWithCourse[];
  };
}

export default function CustomCourseScreen() {
  const insets = useSafeAreaInsets();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isProcessing, setProcessing] = useState(false);

  const notificationBadge = useAppStore((state) => state.notificationBadge);

  const [selectedChapter, setSelectedChapter] = useState<ChapterWithCourse[]>(
    []
  );

  const {
    data: courseElement,
    isError,
    isLoading,
    refetch,
  } = useCourseElement({ token, page_index: 1, page_size: 100 });

  const createCustom = useCreateCustomCourse();

  useFocusEffect(() => {
    refetch();
  });

  if (isLoading) return <ActivityIndicatorScreen />;

  if (!courseElement || courseElement.data.length == 0) {
    return (
      <View className="flex-1 bg-[#f5f7f9]">
        <StatusBar style="dark" />
        {/* Header with gradient */}
        <LinearGradient
          colors={["#3b82f6", "#1d4ed8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-14 pb-6 px-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.push("/(tabs)/home")}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <MaterialIcons name="arrow-back" size={22} color="white" />
              </Pressable>
              <Text className="text-white text-lg font-bold ml-4">
                Khóa học tùy chỉnh
              </Text>
            </View>

            <Pressable
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => router.push("/(root)/notifications/notifications")}
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
        </LinearGradient>

        <View className="flex-1 items-center justify-center p-8">
          <MaterialIcons name="book" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Chưa có dữ liệu để tùy chỉnh
          </Text>
          <Text className="text-gray-400 text-center mb-4">
            Vui lòng quay lại sau khi có các khóa học sẵn sàng
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-5 py-2.5 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-medium">Quay lại trang chủ</Text>
          </Pressable>
        </View>
      </View>
    );
  } else if (isError) {
    return (
      <View className="flex-1 bg-[#f5f7f9]">
        <StatusBar style="dark" />
        {/* Header with gradient */}
        <LinearGradient
          colors={["#3b82f6", "#1d4ed8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-14 pb-6 px-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.push("/(tabs)/home")}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <MaterialIcons name="arrow-back" size={22} color="white" />
              </Pressable>
              <Text className="text-white text-lg font-bold ml-4">
                Khóa học tùy chỉnh
              </Text>
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
        </LinearGradient>

        <View className="flex-1 items-center justify-center p-8">
          <MaterialIcons name="error-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Lỗi trong quá trình tải dữ liệu
          </Text>
          <Text className="text-gray-400 text-center mb-4">
            Vui lòng thử lại sau
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-5 py-2.5 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-medium">Quay lại trang chủ</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleCustomCourse = async () => {
    try {
      if (isProcessing) return;
      setProcessing(true);
      const selectedChapterIds = selectedChapter.map((chapter) => chapter.id);
      const bodyData = {
        chapterIds: selectedChapterIds,
      };

      const res = await createCustom.mutateAsync({
        token,
        body: bodyData,
      });
      Alert.alert(
        "Thông báo",
        "Tạo khóa học tùy chỉnh thành công\nVui lòng đợi thông báo từ chúng tôi",
        [
          {
            text: "Trang chủ",
            onPress: async () => {
              router.push("/(tabs)/home");
            },
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      Alert.alert("Lỗi", `Tạo khóa học tùy chỉnh không thành công ${error}`, [
        {
          text: "Trang chủ",
          onPress: async () => {
            router.push("/(tabs)/home");
          },
          style: "destructive",
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    } finally {
      setTimeout(() => {
        setProcessing(false);
      });
    }
  };

  // Helper function để tìm tên khóa học theo chapterID
  const getCourseNameByChapter = (chapterId: string): string => {
    for (const course of courseElement?.data || []) {
      const foundChapter = course.chapters.find(
        (chapter) => chapter.id === chapterId
      );
      if (foundChapter) {
        return course.title;
      }
    }
    return "Không xác định";
  };

  // Get course by ID
  const getSelectedCourse = () => {
    return courseElement?.data.find((course) => course.id === selectedCourseId);
  };

  // Get chapters from selected course
  const getChaptersFromSelectedCourse = () => {
    const selectedCourse = getSelectedCourse();
    if (!selectedCourse) return [];

    return selectedCourse.chapters.map((chapter) => ({
      ...chapter,
      courseName: selectedCourse.title,
      courseId: selectedCourse.id,
    }));
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowCourseModal(false);
    setShowChapterModal(true);
  };

  const handleAddChapter = (newChapter: ChapterWithCourse) => {
    setSelectedChapter((prevChapters) =>
      prevChapters.some((chapter) => chapter.id === newChapter.id)
        ? prevChapters
        : [...prevChapters, newChapter]
    );
  };

  const removeSelectedChapter = (chapterToRemove: ChapterWithCourse) => {
    setSelectedChapter((prevChapters) =>
      prevChapters.filter((chapter) => chapter.id !== chapterToRemove.id)
    );
  };

  // Group selected chapters by course
  const groupChaptersByCourse = (): GroupedChapters => {
    const groupedChapters: GroupedChapters = {};

    selectedChapter.forEach((chapter) => {
      const courseId = chapter.courseId;
      const courseName =
        chapter.courseName || getCourseNameByChapter(chapter.id);

      if (!groupedChapters[courseId]) {
        groupedChapters[courseId] = {
          courseName,
          chapters: [],
        };
      }

      groupedChapters[courseId].chapters.push(chapter);
    });

    return groupedChapters;
  };

  const groupedChapters = groupChaptersByCourse();

  return (
    <View className="flex-1 bg-[#f5f7f9]">
      <StatusBar style="dark" />

      {/* Header with gradient */}
      <LinearGradient
        colors={["#3b82f6", "#1d4ed8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-6 px-5"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.push("/(tabs)/home")}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={22} color="white" />
            </Pressable>
            <Text className="text-white text-lg font-bold ml-4">
              Khóa học tùy chỉnh
            </Text>
          </View>

          <Pressable
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.push("/(root)/notifications/notifications")}
          >
            <MaterialIcons name="notifications-none" size={22} color="white" />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Content */}
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 py-4">
            <Text className="text-2xl font-bold text-gray-900">
              Tạo khóa học cho riêng bạn
            </Text>
            <Text className="text-gray-600 mt-1 mb-6">
              Chọn các chương từ khóa học của chúng tôi để tạo nên trải nghiệm
              học tập phù hợp với bạn
            </Text>

            {/* Add Course Button */}
            <Pressable
              onPress={() => setShowCourseModal(true)}
              className="bg-blue-600 py-3 px-4 rounded-xl flex-row items-center justify-center mb-6"
            >
              <MaterialIcons
                name="add-circle-outline"
                size={22}
                color="white"
              />
              <Text className="text-white font-bold ml-2">Chọn khóa học</Text>
            </Pressable>

            {/* Selected Chapters Section */}
            <View className="bg-white rounded-xl p-4 mt-2 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="font-semibold text-lg text-gray-900">
                  Các chương đã chọn
                </Text>
                <View className="bg-blue-100 rounded-full px-3 py-1">
                  <Text className="text-blue-700 text-xs font-medium">
                    Tổng: {selectedChapter.length} chương
                  </Text>
                </View>
              </View>

              {selectedChapter.length == 0 ? (
                <View className="py-12 items-center">
                  <MaterialIcons name="amp-stories" size={64} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-3 text-center">
                    Chưa có chương nào được chọn
                  </Text>
                  <Text className="text-gray-400 text-center">
                    Nhấn "Chọn khóa học" để bắt đầu
                  </Text>
                </View>
              ) : (
                <View className="space-y-5">
                  {Object.keys(groupedChapters).map((courseId) => (
                    <View
                      key={courseId}
                      className="border border-gray-100 rounded-xl overflow-hidden"
                    >
                      {/* Course Header */}
                      <View className="bg-indigo-50 p-3 border-b border-indigo-100">
                        <Text className="font-bold text-indigo-800">
                          {groupedChapters[courseId].courseName}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <MaterialIcons
                            name="menu-book"
                            size={16}
                            color="#6366f1"
                          />
                          <Text className="text-indigo-600 text-sm ml-1">
                            {groupedChapters[courseId].chapters.length} chương
                            được chọn
                          </Text>
                        </View>
                      </View>

                      {/* Chapters List */}
                      <View className="p-2">
                        {groupedChapters[courseId].chapters.map((chapter) => (
                          <View
                            key={chapter.id}
                            className="bg-white rounded-xl p-3 my-1 border border-gray-100"
                          >
                            <View className="flex-row justify-between items-start">
                              <View className="flex-1 mr-2">
                                <Text
                                  className="font-bold text-gray-900 mb-1"
                                  numberOfLines={1}
                                >
                                  {chapter.title}
                                </Text>
                                <View className="flex-row items-center mb-1">
                                  <MaterialIcons
                                    name="book"
                                    size={16}
                                    color="#3b82f6"
                                  />
                                  <Text className="text-gray-700 ml-1 text-sm">
                                    {chapter.totalLesson} bài học
                                  </Text>
                                </View>
                              </View>

                              <Pressable
                                onPress={() => removeSelectedChapter(chapter)}
                                className="bg-gray-100 p-1.5 rounded-full"
                              >
                                <MaterialIcons
                                  name="close"
                                  size={18}
                                  color="#6b7280"
                                />
                              </Pressable>
                            </View>

                            <Text
                              className="text-gray-600 mb-2"
                              numberOfLines={2}
                            >
                              {chapter.description}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View className="bg-white px-5 py-4 border-t border-gray-200">
          <Pressable
            className={`py-3 rounded-xl flex-row justify-center items-center ${
              !isProcessing && selectedChapter.length > 0
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
            onPress={handleCustomCourse}
            disabled={isProcessing || selectedChapter.length === 0}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={20}
              color={
                !isProcessing && selectedChapter.length > 0
                  ? "white"
                  : "#9CA3AF"
              }
            />
            <Text
              className={`font-medium ml-2 ${
                !isProcessing && selectedChapter.length > 0
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              {isProcessing ? "Đang xử lý..." : "Tạo khóa học"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Select Course Modal */}
      <Portal>
        <Modal
          visible={showCourseModal}
          onDismiss={() => setShowCourseModal(false)}
        >
          <View className="mx-4">
            <View className="bg-white p-4 rounded-xl shadow-lg">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-900 font-bold text-lg">
                  Chọn khóa học
                </Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => setShowCourseModal(false)}
                />
              </View>

              <Text className="text-gray-600 mb-4">
                Vui lòng chọn một khóa học để xem và chọn các chương
              </Text>

              <ScrollView
                className="max-h-96"
                showsVerticalScrollIndicator={false}
              >
                <View className="space-y-3">
                  {courseElement?.data.map((course) => (
                    <TouchableOpacity
                      key={course.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                      onPress={() => handleSelectCourse(course.id)}
                    >
                      {/* Course Image */}
                      <Image
                        source={{
                          uri:
                            course.imageUrl ||
                            "https://via.placeholder.com/400x200?text=Koine+Course",
                        }}
                        className="w-full h-32"
                        style={{ resizeMode: "cover" }}
                      />

                      {/* Course Info */}
                      <View className="p-3">
                        <Text
                          className="font-bold text-lg text-gray-900"
                          numberOfLines={1}
                        >
                          {course.title}
                        </Text>

                        <View className="flex-row flex-wrap mt-2">
                          <View className="flex-row items-center mr-4 mb-1">
                            <MaterialIcons
                              name="menu-book"
                              size={16}
                              color="#4b5563"
                            />
                            <Text className="text-gray-600 ml-1 text-sm">
                              {course.chapters.length} chương
                            </Text>
                          </View>

                          <View className="flex-row items-center mb-1">
                            <MaterialIcons
                              name="ondemand-video"
                              size={16}
                              color="#4b5563"
                            />
                            <Text className="text-gray-600 ml-1 text-sm">
                              {course.chapters.reduce(
                                (sum, chapter) => sum + chapter.totalLesson,
                                0
                              )}{" "}
                              bài học
                            </Text>
                          </View>
                        </View>

                        <Text className="text-gray-600 mt-2" numberOfLines={2}>
                          {course.description ||
                            "Không có mô tả cho khóa học này"}
                        </Text>

                        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
                          <Text className="text-indigo-600 font-medium">
                            Chọn khóa học này
                          </Text>
                          <MaterialIcons
                            name="arrow-forward"
                            size={20}
                            color="#4f46e5"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Select Chapters Modal */}
      <Portal>
        <Modal
          visible={showChapterModal}
          onDismiss={() => setShowChapterModal(false)}
        >
          <View className="mx-4">
            <View className="bg-white p-4 rounded-xl shadow-lg">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-900 font-bold text-lg">
                  Chọn chương học
                </Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => setShowChapterModal(false)}
                />
              </View>

              {/* Selected Course Info */}
              {selectedCourseId && (
                <View className="bg-indigo-50 rounded-lg p-3 mb-4 flex-row items-center">
                  <MaterialIcons name="school" size={20} color="#4f46e5" />
                  <Text className="text-indigo-800 font-medium ml-2 flex-1">
                    {getSelectedCourse()?.title || ""}
                  </Text>
                  <Text className="text-indigo-600 text-xs">
                    {getChaptersFromSelectedCourse().length} chương
                  </Text>
                </View>
              )}

              <ScrollView
                className="max-h-96"
                showsVerticalScrollIndicator={false}
              >
                <View className="space-y-3 p-1">
                  {getChaptersFromSelectedCourse().map((chapter) => (
                    <TouchableOpacity
                      key={chapter.id}
                      className={`p-3 rounded-xl border ${
                        selectedChapter.some((c) => c.id === chapter.id)
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200"
                      }`}
                      onPress={() => handleAddChapter(chapter)}
                    >
                      <View className="flex-row justify-between items-center mb-1">
                        <Text
                          className="font-bold text-gray-900"
                          numberOfLines={1}
                        >
                          {chapter.title}
                        </Text>
                        {selectedChapter.some((c) => c.id === chapter.id) && (
                          <MaterialIcons
                            name="check-circle"
                            size={20}
                            color="#3b82f6"
                          />
                        )}
                      </View>

                      <View className="flex-row items-center mb-2">
                        <MaterialIcons name="book" size={16} color="#6b7280" />
                        <Text className="text-gray-600 ml-1 text-sm">
                          {chapter.totalLesson} bài học
                        </Text>
                      </View>

                      <Text className="text-gray-600 mb-2" numberOfLines={2}>
                        {chapter.description}
                      </Text>

                      <View className="bg-gray-50 rounded-lg p-2">
                        {chapter.lessons.slice(0, 3).map((lesson) => (
                          <View
                            key={lesson.id}
                            className="flex-row items-center py-1"
                          >
                            <MaterialIcons
                              name={
                                lesson.type === "VIDEO"
                                  ? "videocam"
                                  : lesson.type === "DOCUMENT"
                                  ? "description"
                                  : "library-books"
                              }
                              size={16}
                              color="#6b7280"
                            />
                            <Text
                              numberOfLines={1}
                              className="text-gray-600 ml-2 flex-1 text-sm"
                            >
                              {lesson.title}
                            </Text>
                          </View>
                        ))}
                        {chapter.lessons.length > 3 && (
                          <Text className="text-blue-500 text-xs mt-1 text-right">
                            + {chapter.lessons.length - 3} bài học khác
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View className="flex-row mt-4">
                <Pressable
                  className="bg-gray-200 py-3 rounded-xl flex-1 mr-2 items-center"
                  onPress={() => {
                    setShowChapterModal(false);
                    setShowCourseModal(true);
                  }}
                >
                  <Text className="text-gray-700 font-medium">
                    Đổi khóa học
                  </Text>
                </Pressable>

                <Pressable
                  className="bg-blue-600 py-3 rounded-xl flex-1 ml-2 items-center"
                  onPress={() => setShowChapterModal(false)}
                >
                  <Text className="text-white font-medium">Hoàn tất</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
