import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { courseRes } from "@/schema/course-schema";
import { useCourses } from "@/queries/useCourse";
import { GetAllCourseResType } from "@/schema/course-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";

const TRENDING_KEYWORDS = [
  "Dậy thì",
  "Kỹ năng giao tiếp",
  "Tâm lý tuổi teen",
  "Quản lý cảm xúc",
  "Dinh dưỡng",
  "Sức khỏe sinh sản",
  "Giới tính",
  "Tình bạn",
];

// Hàm để chuẩn hóa chuỗi tìm kiếm
const normalizeSearchString = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/) // Tách theo khoảng trắng (1 hoặc nhiều)
    .filter((word) => word.length > 0); // Loại bỏ chuỗi rỗng
};

// Hàm kiểm tra xem một từ có match với title hay không
const isWordMatch = (word: string, title: string, titleNoTone: string) => {
  const wordLower = word.toLowerCase();
  return (
    title.includes(wordLower) || // Tìm trong title có dấu
    titleNoTone.includes(wordLower) || // Tìm trong title không dấu
    title.startsWith(wordLower) || // Tìm từ đầu title có dấu
    titleNoTone.startsWith(wordLower) // Tìm từ đầu title không dấu
  );
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState<GetAllCourseResType["data"]>([]);
  const [filteredCourses, setFilteredCourses] = useState<
    GetAllCourseResType["data"]
  >([]);

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourses({
    keyword: "",
    page_size: 100,
    page_index: 1,
  });

  // Effect to set all courses when data is loaded
  useEffect(() => {
    if (coursesData && !coursesError) {
      try {
        const parsedResult = courseRes.safeParse(coursesData);
        if (parsedResult.success) {
          setAllCourses(
            parsedResult.data.data.filter(
              (course) => course.isVisible == true && course.isCombo != true
            ) || []
          );
        } else {
          console.error("Validation errors:", parsedResult.error.errors);
        }
      } catch (error) {
        console.error("Error parsing course data:", error);
      }
    }
  }, [coursesData, coursesError]);

  // Effect to filter courses when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCourses([]);
      return;
    }

    const searchWords = normalizeSearchString(searchQuery);

    const filtered = allCourses.filter((course) => {
      const title = course.title.toLowerCase();
      const titleNoTone = course.titleNoTone.toLowerCase();

      let matchScore = 0;

      for (const word of searchWords) {
        if (isWordMatch(word, title, titleNoTone)) {
          matchScore += 1;

          // Tăng điểm nếu match chính xác
          if (title === word || titleNoTone === word) {
            matchScore += 2;
          }
          // Tăng điểm nếu match từ đầu
          if (title.startsWith(word) || titleNoTone.startsWith(word)) {
            matchScore += 1;
          }
        }
      }

      // Kiểm tra xem có match tất cả các từ không
      const hasAllWords = searchWords.every((word) =>
        isWordMatch(word, title, titleNoTone)
      );

      return hasAllWords;
    });

    // Sắp xếp kết quả theo độ phù hợp
    filtered.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleNoToneA = a.titleNoTone.toLowerCase();
      const titleB = b.title.toLowerCase();
      const titleNoToneB = b.titleNoTone.toLowerCase();

      // So sánh độ chính xác của match
      const exactMatchA = searchWords.some(
        (word) => titleA === word || titleNoToneA === word
      );
      const exactMatchB = searchWords.some(
        (word) => titleB === word || titleNoToneB === word
      );

      if (exactMatchA && !exactMatchB) return -1;
      if (!exactMatchA && exactMatchB) return 1;

      // So sánh match từ đầu chuỗi
      const startsWithA = searchWords.some(
        (word) => titleA.startsWith(word) || titleNoToneA.startsWith(word)
      );
      const startsWithB = searchWords.some(
        (word) => titleB.startsWith(word) || titleNoToneB.startsWith(word)
      );

      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;

      return 0;
    });

    setFilteredCourses(filtered);
  }, [searchQuery, allCourses]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  if (coursesLoading) {
    return <ActivityIndicatorScreen />;
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack title="Tìm kiếm" showMoreOptions={false} />

      <View className="p-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
          <MaterialIcons name="search" size={24} color="#6B7280" />
          <TextInput
            className="flex-1 py-3 px-2"
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery ? (
            <Pressable onPress={() => handleSearch("")} hitSlop={8}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView>
        <View className="px-4 mb-6">
          <Text className="font-bold text-lg mb-3">Xu hướng tìm kiếm</Text>
          <View className="flex-row flex-wrap">
            {TRENDING_KEYWORDS.map((keyword) => (
              <Pressable
                key={keyword}
                className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
                onPress={() => handleSearch(keyword)}
              >
                <Text className="text-gray-700">{keyword}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {searchQuery != "" ? (
          <View className="px-4">
            <Text className="font-bold text-gray-600 mb-4">
              {filteredCourses.length} kết quả cho "{searchQuery}"
            </Text>
            {filteredCourses.map((course) => (
              <Pressable
                key={course.id}
                className="flex-row items-center p-3 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: "/courses/[id]",
                    params: { id: course.id },
                  })
                }
              >
                <Image
                  source={{ uri: course.imageUrl }}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text
                    className="font-semibold text-base text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    {course.title}
                  </Text>
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {!course.categories.length ? (
                      <View className="flex-row justify-center items-center bg-blue-50 px-3 py-1 rounded-full">
                        <MaterialIcons
                          name="category"
                          size={12}
                          color="#6B7280"
                        />
                        <Text className="pl-1 text-blue-600 text-xs font-medium">
                          --
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap gap-1">
                        {course.categories.slice(0, 3).map((category) => (
                          <View
                            key={category.id}
                            className="flex-row justify-center items-center bg-blue-50 px-3 py-1 rounded-full"
                          >
                            <MaterialIcons
                              name="category"
                              size={12}
                              color="#6B7280"
                            />
                            <Text className="pl-1 text-blue-600 text-xs font-medium">
                              {category.name}
                            </Text>
                          </View>
                        ))}
                        {course.categories.length > 3 && (
                          <View className=" bg-blue-50 px-3 py-1 rounded-full">
                            <Text className=" text-blue-600 text-xs font-medium">
                              ...
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="signal-cellular-alt"
                        size={16}
                        color="#6B7280"
                      />
                      <Text className="text-gray-500 text-sm ml-1">
                        {course.level == null
                          ? "Chưa có cấp độ"
                          : course.level == "ALL"
                          ? "Tất cả"
                          : course.level == "BEGINNER"
                          ? "Khởi đầu"
                          : course.level == "INTERMEDIATE"
                          ? "Trung cấp"
                          : "Nâng cao"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="people" size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {course.ageStage || "18+"} tuổi
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}

            {filteredCourses.length === 0 && (
              <View className="p-4 items-center">
                <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 text-center">
                  Không tìm thấy kết quả nào cho "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="px-4">
            <Text className="font-bold text-gray-600 mb-4">
              Khóa học nổi bật
            </Text>
            {allCourses.map((course) => (
              <Pressable
                key={course.id}
                className="flex-row items-center p-3 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: "/courses/[id]",
                    params: { id: course.id },
                  })
                }
              >
                <Image
                  source={{ uri: course.imageUrl }}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text
                    className="font-semibold text-base text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    {course.title}
                  </Text>
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {!course.categories.length ? (
                      <View className="flex-row justify-center items-center bg-blue-50 px-3 py-1 rounded-full">
                        <MaterialIcons
                          name="category"
                          size={12}
                          color="#6B7280"
                        />
                        <Text className="pl-1 text-blue-600 text-xs font-medium">
                          --
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap gap-1">
                        {course.categories.slice(0, 3).map((category) => (
                          <View
                            key={category.id}
                            className="flex-row justify-center items-center bg-blue-50 px-3 py-1 rounded-full"
                          >
                            <MaterialIcons
                              name="category"
                              size={12}
                              color="#6B7280"
                            />
                            <Text className="pl-1 text-blue-600 text-xs font-medium">
                              {category.name}
                            </Text>
                          </View>
                        ))}
                        {course.categories.length > 3 && (
                          <View className=" bg-blue-50 px-3 py-1 rounded-full">
                            <Text className=" text-blue-600 text-xs font-medium">
                              ...
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="signal-cellular-alt"
                        size={16}
                        color="#6B7280"
                      />
                      <Text className="text-gray-500 text-sm ml-1">
                        {course.level == null
                          ? "Chưa có cấp độ"
                          : course.level == "ALL"
                          ? "Tất cả"
                          : course.level == "BEGINNER"
                          ? "Khởi đầu"
                          : course.level == "INTERMEDIATE"
                          ? "Trung cấp"
                          : "Nâng cao"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="people" size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {course.ageStage || "18+"} tuổi
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
