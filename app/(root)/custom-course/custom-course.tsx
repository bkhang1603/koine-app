import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useCourseElement, useCreateCustomCourse } from "@/queries/useCourse";
import { CourseElementResType } from "@/schema/course-schema";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { IconButton, Modal, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomCourseScreen() {
  const insets = useSafeAreaInsets();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setProcessing] = useState(false);

  const [selectedChapter, setSelectedChapter] = useState<
    CourseElementResType["data"][0]["chapters"]
  >([]);

  const {
    data: courseElement,
    isError,
    isLoading,
    refetch,
  } = useCourseElement({ token });

  const createCustom = useCreateCustomCourse();

  useFocusEffect(() => {
    refetch();
  });

  if (isLoading) return <ActivityIndicatorScreen />;

  if (!courseElement || courseElement.data.length == 0) {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <HeaderWithBack title="Khóa học tùy chỉnh" showMoreOptions={false} />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="book" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Chưa có dữ liệu để tùy chỉnh
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-bold">Tiếp tục mua sắm</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 bg-white"></ScrollView>
      </View>
    );
  } else if (isError) {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <HeaderWithBack title="Khóa học tùy chỉnh" showMoreOptions={false} />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="book" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Lỗi trong quá trình tải dữ liệu
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-bold">Quay lại trang chủ</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 bg-white"></ScrollView>
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

      const res = await createCustom.mutateAsync({ token, body: bodyData });
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

  const chaptersArray =
    courseElement?.data.flatMap((course) => course.chapters) || [];
  const handleAddChapter = (
    newChapter: CourseElementResType["data"][0]["chapters"][0]
  ) => {
    setSelectedChapter((prevChapters) =>
      prevChapters.some((chapter) => chapter.id === newChapter.id)
        ? prevChapters
        : [...prevChapters, newChapter]
    );
  };

  const removeSelectedChapter = (
    chapterToRemove: CourseElementResType["data"][0]["chapters"][0]
  ) => {
    setSelectedChapter((prevChapters) =>
      prevChapters.filter((chapter) => chapter.id !== chapterToRemove.id)
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <HeaderWithBack title="Khóa học tùy chỉnh" showMoreOptions={false} />

      {/* Selected Chapters */}
      <ScrollView className="flex-1 bg-white">
        <View className="p-2 flex-row justify-between items-center">
          <Text className="font-bold text-lg">Các chương đã chọn</Text>
          <TouchableOpacity
            onPress={() => {
              setShowModal(true);
            }}
            className="bg-blue-500 rounded-xl"
          >
            <Text className="text-white p-2">+ Danh sách chương</Text>
          </TouchableOpacity>
        </View>

        {selectedChapter.length == 0 ? (
          <View className="flex justify-center items-center">
            <Text>Chưa có chương nào được chọn</Text>
          </View>
        ) : (
          <View>
            <View className="flex items-end">
              <Text className="text-gray-500 italic mr-2 p-2">
                Đã chọn: {selectedChapter.length} chương
              </Text>
            </View>
            {selectedChapter.map((chapter) => (
              <View
                key={chapter.id}
                className="bg-white rounded-xl p-2 m-1 border-gray-300 border-[2px]"
              >
                <Pressable
                  onPress={() => removeSelectedChapter(chapter)}
                  hitSlop={8}
                  className="self-end"
                >
                  <MaterialIcons
                    name={"remove-circle-outline"}
                    size={24}
                    color={"gray"}
                  />
                </Pressable>
                <View>
                  <Text numberOfLines={1} className="font-semibold text-sm">
                    {chapter.title}
                  </Text>
                  <Text className="font-semibold text-sm">
                    {chapter.totalLesson} bài
                  </Text>

                  <Text className="mb-1" numberOfLines={3}>
                    {chapter.description}
                  </Text>
                  <View>
                    {chapter.lessons.map((lesson) => (
                      <View
                        key={lesson.id}
                        className="flex-row items-center p-1 w-[96%]"
                      >
                        <MaterialIcons
                          name={
                            lesson.type === "VIDEO"
                              ? "videocam"
                              : lesson.type === "DOCUMENT"
                              ? "description"
                              : "library-books"
                          }
                          size={20}
                          color="blue"
                        />
                        <Text numberOfLines={2} className="pl-1 font-semibold">
                          {lesson.title}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Select Chapters Modal */}
      <Portal>
        <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
          <View className="mx-3">
            <View className="bg-slate-200 p-5 rounded-lg">
              <View className="flex-row justify-between items-center">
                <Text className="text-black font-bold text-base py-2">
                  Danh sách chương - Tổng: {chaptersArray.length} chương
                </Text>
                <IconButton
                  icon="close"
                  className="self-end"
                  onPress={() => {
                    setShowModal(false);
                  }}
                />
              </View>
              <ScrollView
                className="max-h-96 w-[100%]"
                showsVerticalScrollIndicator={false}
              >
                {chaptersArray.map((chapter) => (
                  <TouchableOpacity
                    key={chapter.id}
                    className={`${
                      selectedChapter.some((c) => c.id === chapter.id)
                        ? "bg-cyan-200"
                        : "bg-white"
                    } rounded-xl p-1 m-1 border-gray-300 w-[100%]`}
                    onPress={() => handleAddChapter(chapter)}
                  >
                    <Text numberOfLines={1} className="font-semibold">
                      {chapter.title}
                    </Text>
                    <Text className="font-semibold">
                      {chapter.totalLesson} bài
                    </Text>

                    <Text numberOfLines={4}>{chapter.description}</Text>
                    <View>
                      {chapter.lessons.map((lesson) => (
                        <View key={lesson.id} className="flex-row items-center p-1 w-[96%]">
                          <MaterialIcons
                            name={
                              lesson.type === "VIDEO"
                                ? "videocam"
                                : lesson.type === "DOCUMENT"
                                ? "description"
                                : "library-books"
                            }
                            size={20}
                            color="blue"
                          />
                          <Text
                            numberOfLines={2}
                            className="font-semibold pl-1"
                          >
                            {lesson.title}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Bottom Bar */}
      <View className="p-2 border-t border-gray-200 bg-white justify-between items-center">
        <Pressable
          className={`px-8 py-4 rounded-2xl ${
            !isProcessing && selectedChapter.length > 0
              ? "bg-blue-600"
              : "bg-gray-300"
          }`}
          onPress={handleCustomCourse}
          disabled={selectedChapter.length == 0}
        >
          <Text
            className={`font-bold text-base ${
              !isProcessing && selectedChapter.length > 0
                ? "text-white"
                : "text-gray-500"
            }`}
          >
            Tạo khóa học
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
