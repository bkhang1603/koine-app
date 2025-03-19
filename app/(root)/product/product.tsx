import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBack from "@/components/HeaderWithBack";
import { GetAllProductResType, productRes } from "@/schema/product-schema";
import CartButton from "@/components/CartButton";
import { Foundation, MaterialIcons } from "@expo/vector-icons";
import { useAllProduct } from "@/queries/useProduct";
import { useAppStore } from "@/components/app-provider";
import { useFocusEffect } from "expo-router";

export default function ProductsScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const {
    data: productListData,
    isLoading: productListDataLoading,
    isError: productListDataError,
    refetch: refetchProductList,
  } = useAllProduct({
    token: token as string,
  });

  useFocusEffect(() => {
    refetchProductList();
  });

  if (!productListData || productListDataLoading) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title="Danh sách sản phẩm"
          returnTab={"/(tabs)/home"}
          showMoreOptions={false}
        />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="shopping-cart" size={34} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Danh sách sản phẩm trống
          </Text>
        </View>
      </View>
    );
  }

  let parsedProductList: GetAllProductResType["data"] = [];

  const result = productRes.safeParse(productListData);
  if (result.success) {
    parsedProductList = result.data.data;
  } else {
    console.error("My course validation errors:", result.error.errors);
  }

  return (
    <View className="flex-1 bg-white">
      {parsedProductList.length === 0 ? (
        <View>
          {" "}
          <HeaderWithBack
            title="Danh sách sản phẩm"
            returnTab={"/(tabs)/home"}
            showMoreOptions={false}
          />
          <View className="flex-1 items-center justify-center p-4">
            <MaterialIcons name="shop" size={34} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              Danh sách sản phẩm trống
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView className="flex-1 bg-white">
          <SafeAreaView>
            {/* Header */}
            <View className="px-4 flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold">Sản phẩm</Text>
                <Text className="text-gray-600 mt-1">
                  Khám phá các sản phẩm
                </Text>
              </View>

              <View className="flex-row items-center">
                <Pressable
                  className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-2"
                  onPress={() => router.push("/(tabs)/home")}
                >
                  <MaterialIcons name="home" size={24} color="#374151" />
                </Pressable>
                <CartButton />
                <Pressable
                  className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-2"
                  onPress={() => router.push("/notifications/notifications")}
                >
                  <MaterialIcons
                    name="notifications"
                    size={24}
                    color="#374151"
                  />
                </Pressable>
              </View>
            </View>

            {/* Search Bar */}
            <Pressable
              className="mx-4 mt-4 flex-row items-center bg-gray-100 rounded-xl p-3"
              onPress={() => {
                router.push("/search/searchProduct");
              }}
            >
              <MaterialIcons name="search" size={24} color="#6B7280" />
              <Text className="ml-2 text-gray-500 flex-1">
                Tìm kiếm sản phẩm...
              </Text>
            </Pressable>

            {/* Featured Course */}
            {parsedProductList && (
              <View className="p-4">
                <Text className="text-lg font-bold mb-3">Nổi bật</Text>
                <Pressable
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  onPress={() => {
                    const productDetail = JSON.stringify(parsedProductList[0]);
                    router.push({
                      pathname: "/product/[id]",
                      params: {
                        id: parsedProductList[0].id,
                        productDetail: productDetail,
                      },
                    });
                  }}
                >
                  <Image
                    source={{ uri: parsedProductList[0].images[0].imageUrl }}
                    className="w-full h-48"
                  />
                  <View className="p-4">
                    <View className="flex-row flex-wrap gap-1">
                      {!parsedProductList[0].categories.length ? (
                        <View className="bg-blue-50 px-3 py-1 rounded-full">
                          <Text className="text-blue-600 text-xs font-medium">
                            --
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row flex-wrap gap-1">
                          {parsedProductList[0].categories
                            .slice(0, 4)
                            .map((category) => (
                              <View
                                key={category.id}
                                className="bg-blue-50 px-3 py-1 rounded-full"
                              >
                                <Text className="text-blue-600 text-xs font-medium">
                                  {category.name}
                                </Text>
                              </View>
                            ))}
                          {parsedProductList[0].categories.length > 4 && (
                            <View className="bg-blue-50 px-3 py-1 rounded-full">
                              <Text className="text-blue-600 text-xs font-medium">
                                ...
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                    <Text className="text-lg font-bold mt-2">
                      {parsedProductList[0].name}
                    </Text>
                    <Text className="text-gray-600 mt-1" numberOfLines={2}>
                      {parsedProductList[0].description}
                    </Text>
                    <View className="flex-row items-center mt-3">
                      <MaterialIcons
                        name="schedule"
                        size={16}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 ml-1">
                        {parsedProductList[0].createdAtFormatted.split("-")[1]}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-3">
                      <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <MaterialIcons
                            name="star"
                            size={14}
                            color="#F59E0B"
                          />
                          <Text className="ml-1 text-sm font-medium text-yellow-600">
                            {parsedProductList[0].averageRating == 0
                              ? 5
                              : parsedProductList[0].averageRating}
                          </Text>
                        </View>
                        {parsedProductList[0] &&
                        parsedProductList[0].discount != 0 ? (
                          <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full">
                            <Foundation
                              name="burst-sale"
                              size={14}
                              color="#8B5CF6"
                            />

                            <Text className="ml-1 text-sm font-medium text-purple-600">
                              {parsedProductList[0].discount
                                ? `${parsedProductList[0].discount * 100}%`
                                : "0%"}
                            </Text>
                          </View>
                        ) : (
                          <></>
                        )}
                      </View>
                      <Text
                        className={`font-bold ${
                          parsedProductList[0].price === 0
                            ? "text-green-500"
                            : "text-blue-500"
                        }`}
                      >
                        {parsedProductList[0].price !== 0
                          ? parsedProductList[0].price.toLocaleString("vi-VN") +
                            " ₫"
                          : "Miễn phí"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}

            {/* Product List */}
            <View className="px-4">
              <Text className="text-lg font-bold mb-4">Tất cả sản phẩm</Text>
              {parsedProductList.map((product) => (
                <Pressable
                  key={product.id}
                  className="bg-white rounded-2xl mb-4 overflow-hidden flex-row"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  onPress={() => {
                    const productDetail = JSON.stringify(product);
                    router.push({
                      pathname: "/product/[id]",
                      params: { id: product.id, productDetail: productDetail },
                    });
                  }}
                >
                  <Image
                    source={{ uri: product.images[0].imageUrl }}
                    className="w-32 h-full rounded-l-2xl"
                    style={{ resizeMode: "cover" }}
                  />
                  <View className="flex-1 p-3 justify-between">
                    <View>
                      <View className="flex-row items-center mb-1">
                        <View className="flex-row flex-wrap gap-1">
                          {!product.categories.length ? (
                            <View className="bg-blue-50 px-3 py-1 rounded-full">
                              <Text className="text-blue-600 text-xs font-medium">
                                --
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row flex-wrap gap-1">
                              {product.categories
                                .slice(0, 2)
                                .map((category) => (
                                  <View
                                    key={category.id}
                                    className="bg-blue-50 px-3 py-1 rounded-full"
                                  >
                                    <Text className="text-blue-600 text-xs font-medium">
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
                      </View>
                      <Text className="font-bold text-base" numberOfLines={2}>
                        {product.name.length > 25
                          ? product.name.substring(0, 25) + "..."
                          : product.name}
                      </Text>
                    </View>

                    <View>
                      <Text className="text-gray-600 mt-1" numberOfLines={2}>
                        {parsedProductList[0].description}
                      </Text>

                      <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center gap-2">
                          <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                            <MaterialIcons
                              name="star"
                              size={14}
                              color="#F59E0B"
                            />
                            <Text className="ml-1 text-sm font-medium text-yellow-600">
                              {product.averageRating == 0
                                ? 5
                                : product.averageRating}
                            </Text>
                          </View>
                          {product && product.discount != 0 ? (
                            <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full">
                              <Foundation
                                name="burst-sale"
                                size={14}
                                color="#8B5CF6"
                              />

                              <Text className="ml-1 text-sm font-medium text-purple-600">
                                {product.discount
                                  ? `${product.discount * 100}%`
                                  : "0%"}
                              </Text>
                            </View>
                          ) : (
                            <></>
                          )}
                        </View>
                        <Text
                          className={`font-bold ${
                            product.price === 0
                              ? "text-green-500"
                              : "text-blue-500"
                          }`}
                        >
                          {product.price !== 0
                            ? product.price.toLocaleString("vi-VN") + " ₫"
                            : "Miễn phí"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
            <View className="h-20"></View>
          </SafeAreaView>
        </ScrollView>
      )}
    </View>
  );
}
