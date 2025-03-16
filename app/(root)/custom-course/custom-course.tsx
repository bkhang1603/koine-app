import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useCourseElement } from "@/queries/useCourse";
import { CourseElementResType } from "@/schema/course-schema";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomCourseScreen() {
  const insets = useSafeAreaInsets();
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const [showModal, setShowModal] = useState(false);

  const [selectedChapter, setSelectedChapter] = useState<
    CourseElementResType["data"][0]["chapters"]
  >([]);
  const {
    data: courseElement,
    isError,
    isLoading,
    refetch,
  } = useCourseElement({ token });

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

  const [isProcessing, setProcessing] = useState(false);

  const handleCustomCourse = async () => {
    try {
      if (isProcessing) return;
      setProcessing(true);

      Alert.alert("Thông báo", "Tạo khóa học tùy chỉnh thành công", [
        {
          text: "Trang chủ",
          onPress: async () => {
            router.push("/(tabs)/home");
          },
          style: "cancel",
        },
        {
          text: "Đơn hàng",
          onPress: async () => {
            router.push("/(root)/orders/orders");
          },
          style: "destructive",
        },
      ]);
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
    setSelectedChapter((prevChapters) => [...prevChapters, newChapter]);
  };

  const removeSelectedChapter = (
    chapter: CourseElementResType["data"][0]["chapters"][0]
  ) => {
    setSelectedChapter(
      selectedChapter.filter((chapter) => chapter !== chapter)
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <HeaderWithBack title="Khóa học tùy chỉnh" showMoreOptions={false} />

      {/* Selected Chapters */}
      <ScrollView className="flex-1 bg-white">
        <View className="p-2 flex-row justify-between items-center">
          <Text>Các chương đã chọn</Text>
          <TouchableOpacity
            onPress={() => {
              setShowModal(true);
            }}
            className="bg-blue-500 rounded-xl"
          >
            <Text className="text-white p-2">Danh sách chương</Text>
          </TouchableOpacity>
        </View>

        {selectedChapter.length == 0 ? (
          <View className="flex justify-center items-center">
            <Text>Chưa có chương nào được chọn</Text>
          </View>
        ) : (
          <View>
            <View className="flex items-end">
              <Text className="text-gray-500 italic">
                Đã chọn: {selectedChapter.length} chương
              </Text>
            </View>
            {selectedChapter.map((chapter) => (
              <View className="bg-white rounded-xl p-2 border-gray-300 border-[0.5px]">
                <Pressable
                  onPress={() => removeSelectedChapter(chapter)}
                  hitSlop={8}
                  className="self-center"
                >
                  <MaterialIcons
                    name={"remove-circle-outline"}
                    size={24}
                    color={"gray"}
                  />
                </Pressable>
                <View className="flex-row ml-1">
                  <Text>{chapter.title} - </Text>
                  <Text>{chapter.totalLesson} bài</Text>
                </View>
                <Text numberOfLines={2}>{chapter.description}</Text>
                <View>
                  {chapter.lessons.map((lesson) => (
                    <View className="flex-row items-center p-1">
                      <MaterialIcons
                        name={
                          lesson.type === "VIDEO"
                            ? "videocam"
                            : lesson.type === "DOCUMENT"
                            ? "description"
                            : "library-books"
                        }
                        size={20}
                        color="#3B82F6"
                      />
                      <Text>{lesson.title}</Text>
                    </View>
                  ))}
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
              <Text className="text-black font-bold">
                Danh sách chương - Tổng: {chaptersArray.length} chương
              </Text>
              <ScrollView
                className="max-h-72"
                showsVerticalScrollIndicator={false}
              >
                {chaptersArray.map((chapter) => (
                  <TouchableOpacity
                    key={chapter.id}
                    className="bg-white rounded-xl p-2 border-gray-300 border-[0.5px]"
                    onPress={() => handleAddChapter(chapter)}
                  >
                    <View className="flex-row">
                      <Text>{chapter.title} - </Text>
                      <Text>{chapter.totalLesson} bài</Text>
                    </View>
                    <Text numberOfLines={2}>{chapter.description}</Text>
                    <View>
                      {chapter.lessons.map((lesson) => (
                        <View className="flex-row items-center p-1">
                          <MaterialIcons
                            name={
                              lesson.type === "VIDEO"
                                ? "videocam"
                                : lesson.type === "DOCUMENT"
                                ? "description"
                                : "library-books"
                            }
                            size={20}
                            color="#3B82F6"
                          />
                          <Text>{lesson.title}</Text>
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
      <View className="p-5 border-t border-gray-100 bg-white">
        <View className="flex-row justify-between items-center">
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
              className={`font-bold text-lg ${
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
    </View>
  );
}
