import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Foundation, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useOrder } from "@/queries/useOrder";
import { GetAllOrderResType, orderRes } from "@/schema/order-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import { GetAllProductResType } from "@/schema/product-schema";
import { Animated } from "react-native";

export default function ProductDetailScreen() {
  const { id, productDetail } = useLocalSearchParams();

  let parsedProductDetail: GetAllProductResType["data"][0];
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const shakeAnimation = new Animated.Value(0);
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
    ]).start();
  };

  const handleAddToCart = async () => {};

  // Đảm bảo productList là một chuỗi JSON hợp lệ
  if (typeof productDetail === "string") {
    try {
      parsedProductDetail = JSON.parse(
        decodeURIComponent(productDetail)
      ) as GetAllProductResType["data"][0];

      return (
        <View className="flex-1 bg-white">
          {/* Header */}
          <HeaderWithBack
            title="Chi tiết sản phẩm"
            returnTab={"/(root)/product/product"}
            showMoreOptions={false}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4 pb-2"
          >
            <View className="w-full">
              <Image
                source={{ uri: parsedProductDetail.images[0].imageUrl }}
                className="w-full h-32"
                style={{ resizeMode: "cover" }}
              />
              <View className="p-3">
                <View className="flex-row flex-wrap gap-2 mb-1">
                  {parsedProductDetail.categories.map((category) => (
                    <View
                      key={category.id}
                      className="bg-blue-50 px-3 py-1 rounded-full"
                    >
                      <Text className="text-blue-600 text-xs font-medium">
                        {category.name}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text className="font-bold mt-2 text-lg" numberOfLines={2}>
                  {parsedProductDetail.name.length > 25
                    ? parsedProductDetail.name.substring(0, 25) + "..."
                    : parsedProductDetail.name}
                </Text>
                <Text
                  className="text-gray-500 text-xs mt-1 mb-2"
                  numberOfLines={1}
                >
                  {parsedProductDetail.description.length > 30
                    ? parsedProductDetail.description.substring(0, 30) + "..."
                    : parsedProductDetail.description}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <MaterialIcons name="star" size={14} color="#F59E0B" />
                      <Text className="ml-1 text-sm font-medium text-yellow-600">
                        {parsedProductDetail.averageRating == 0
                          ? 5
                          : parsedProductDetail.averageRating}
                      </Text>
                    </View>
                    {parsedProductDetail &&
                    parsedProductDetail.discount != 0 ? (
                      <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full">
                        <Foundation
                          name="burst-sale"
                          size={14}
                          color="#8B5CF6"
                        />
                        <Text className="ml-1 text-sm font-medium text-purple-600">
                          {parsedProductDetail.discount
                            ? `${parsedProductDetail.discount * 100}%`
                            : "0%"}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                  <Text
                    className={`font-bold ${
                      parsedProductDetail.price === 0
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {parsedProductDetail.price !== 0
                      ? parsedProductDetail.price.toLocaleString("vi-VN") + " ₫"
                      : "Miễn phí"}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View
            className="bg-white border-t border-gray-200 px-6 py-4"
            style={{ paddingBottom: insets.bottom + 8 }}
          >
            <View className="flex-row items-center justify-between mb-5">
              <View>
                <Text className="text-gray-500 text-sm mb-1">Học phí</Text>
                <Text className="text-2xl font-bold text-blue-500">
                  {parsedProductDetail.price === 0
                    ? "Miễn phí"
                    : `${parsedProductDetail.price.toLocaleString("vi-VN")} ₫`}
                </Text>
              </View>

              {parsedProductDetail.price > 0 && (
                <View>
                  <Text className="text-gray-500 text-sm mb-2 text-center">
                    Số lượng
                  </Text>
                  <View className="flex-row items-center">
                    <Pressable
                      className="w-9 h-9 items-center justify-center rounded-lg bg-gray-100"
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <MaterialIcons
                        name="remove"
                        size={20}
                        color={quantity <= 1 ? "#9CA3AF" : "#374151"}
                      />
                    </Pressable>
                    <Animated.Text
                      className="mx-4 font-semibold text-lg"
                      style={{ transform: [{ translateX: shakeAnimation }] }}
                    >
                      {quantity}
                    </Animated.Text>
                    <Pressable
                      className="w-9 h-9 items-center justify-center rounded-lg bg-gray-100"
                      onPress={() => {
                        if (quantity >= 3) {
                          shake();
                        } else {
                          setQuantity(quantity + 1);
                        }
                      }}
                    >
                      <MaterialIcons
                        name="add"
                        size={20}
                        color={quantity >= 3 ? "#9CA3AF" : "#374151"}
                      />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            <Pressable
              className={`py-4 bg-blue-500 rounded-xl items-center`}
              onPress={handleAddToCart}
            >
              <Text className="text-white font-bold text-base">
                Thêm vào giỏ hàng •{" "}
                {(parsedProductDetail.price * quantity).toLocaleString("vi-VN")}{" "}
                ₫
              </Text>
            </Pressable>
          </View>
        </View>
      );
    } catch (error) {
      console.log("Lỗi ở product detail ", error);
      return (
        <View className="flex-1 bg-white">
          {/* Header */}
          <HeaderWithBack
            title="Chi tiết sản phẩm"
            returnTab={"/(root)/product/product"}
            showMoreOptions={false}
          />
          <Text>Không tìm thấy thông tin sản phẩm</Text>
        </View>
      );
    }
  } else {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <HeaderWithBack
          title="Chi tiết sản phẩm"
          returnTab={"/(root)/product/product"}
          showMoreOptions={false}
        />
        <Text>Không tìm thấy thông tin sản phẩm</Text>
      </View>
    );
  }
}
