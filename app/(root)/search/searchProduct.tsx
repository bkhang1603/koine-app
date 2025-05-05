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
import { productRes } from "@/schema/product-schema";
import { useAllProduct } from "@/queries/useProduct";
import { GetAllProductResType } from "@/schema/product-schema";
import { useAppStore } from "@/components/app-provider";

const TRENDING_KEYWORDS = [
  "Áo",
  "Quần",
  "Giày",
  "Túi xách",
  "Phụ kiện",
  "Đồng hồ",
  "Mũ",
  "Kính",
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
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<GetAllProductResType["data"]>(
    []
  );
  const [filteredProducts, setFilteredProducts] = useState<
    GetAllProductResType["data"]
  >([]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useAllProduct({
    token: token, // Cần thêm token vào đây
    page_index: 1,
    page_size: 100,
  });

  // Effect to set all products when data is loaded
  useEffect(() => {
    if (productsData && !productsError) {
      try {
        const parsedResult = productRes.safeParse(productsData);
        if (parsedResult.success) {
          setAllProducts(parsedResult.data.data || []);
        } else {
          console.error("Validation errors:", parsedResult.error.errors);
        }
      } catch (error) {
        console.error("Error parsing product data:", error);
      }
    }
  }, [productsData, productsError]);

  // Effect to filter products when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const searchWords = normalizeSearchString(searchQuery);

    const filtered = allProducts.filter((product) => {
      const name = product.name.toLowerCase();
      const nameNoTone = product.nameNoTone.toLowerCase();

      // Tính điểm match cho mỗi sản phẩm
      let matchScore = 0;

      for (const word of searchWords) {
        if (isWordMatch(word, name, nameNoTone)) {
          matchScore += 1;

          // Tăng điểm nếu match chính xác
          if (name === word || nameNoTone === word) {
            matchScore += 2;
          }
          // Tăng điểm nếu match từ đầu
          if (name.startsWith(word) || nameNoTone.startsWith(word)) {
            matchScore += 1;
          }
        }
      }

      // Kiểm tra xem có match tất cả các từ không
      const hasAllWords = searchWords.every((word) =>
        isWordMatch(word, name, nameNoTone)
      );

      return hasAllWords;
    });

    // Sắp xếp kết quả theo độ phù hợp
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameNoToneA = a.nameNoTone.toLowerCase();
      const nameB = b.name.toLowerCase();
      const nameNoToneB = b.nameNoTone.toLowerCase();

      // So sánh độ chính xác của match
      const exactMatchA = searchWords.some(
        (word) => nameA === word || nameNoToneA === word
      );
      const exactMatchB = searchWords.some(
        (word) => nameB === word || nameNoToneB === word
      );

      if (exactMatchA && !exactMatchB) return -1;
      if (!exactMatchA && exactMatchB) return 1;

      // So sánh match từ đầu chuỗi
      const startsWithA = searchWords.some(
        (word) => nameA.startsWith(word) || nameNoToneA.startsWith(word)
      );
      const startsWithB = searchWords.some(
        (word) => nameB.startsWith(word) || nameNoToneB.startsWith(word)
      );

      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;

      return 0;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, allProducts]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  if (productsLoading) {
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
            placeholder="Tìm kiếm sản phẩm..."
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
              {filteredProducts.length} kết quả cho "{searchQuery}"
            </Text>
            {filteredProducts.map((product) => (
              <Pressable
                key={product.id}
                className="flex-row items-center p-3 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: product.id },
                  })
                }
              >
                <Image
                  source={{ uri: product.images[0]?.imageUrl }}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text
                    className="font-semibold text-base text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {!product.categories.length ? (
                      <View className=" bg-blue-50 px-3 py-1 rounded-full">
                        <Text className="pl-1 text-blue-600 text-xs font-medium">
                          --
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((category) => (
                          <View
                            key={category.id}
                            className=" bg-blue-50 px-3 py-1 rounded-full"
                          >
                            <Text className="pl-1 text-blue-600 text-xs font-medium">
                              {category.name}
                            </Text>
                          </View>
                        ))}
                        {product.categories.length > 2 && (
                          <View className="bg-blue-50 px-3 py-1 rounded-full">
                            <Text className="text-blue-600 text-xs font-medium">
                              ...
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-sm ml-1">
                        {product.price.toLocaleString("vi-VN")} đ
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="star" size={16} color="#EAB308" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {product.averageRating || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}

            {filteredProducts.length === 0 && (
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
              Sản phẩm nổi bật
            </Text>
            {allProducts.map((product) => (
              <Pressable
                key={product.id}
                className="flex-row items-center p-3 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: product.id },
                  })
                }
              >
                <Image
                  source={{ uri: product.images[0]?.imageUrl }}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text
                    className="font-semibold text-base text-gray-900 mb-1"
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {!product.categories.length ? (
                      <View className=" bg-blue-50 px-3 py-1 rounded-full">
                        <Text className="pl-1 text-blue-600 text-xs font-medium">
                          --
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((category) => (
                          <View
                            key={category.id}
                            className=" bg-blue-50 px-3 py-1 rounded-full"
                          >
                            <Text className="pl-1 text-blue-600 text-xs font-medium">
                              {category.name}
                            </Text>
                          </View>
                        ))}
                        {product.categories.length > 2 && (
                          <View className="bg-blue-50 px-3 py-1 rounded-full">
                            <Text className="text-blue-600 text-xs font-medium">
                              ...
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-500 text-sm ml-1">
                      {product.price.toLocaleString("vi-VN")} đ
                    </Text>
                    <View className="flex-row items-center">
                      <MaterialIcons name="star" size={16} color="#EAB308" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {product.averageRating || 0}
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
