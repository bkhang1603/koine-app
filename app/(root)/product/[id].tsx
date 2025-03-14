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
import { useCreateCartItemMutation } from "@/queries/useCart";
import { Alert } from "react-native";
import CartButton from "@/components/CartButton";
import { ActivityIndicator } from "react-native";

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
  const [isProcessing, setProcessing] = useState(false);
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  //ở đây nhét thêm cái cart vô cho người ta biết có bao nhiêu sản phẩm trong cart rồi

  const createCartItemMutation = useCreateCartItemMutation();
  const handleAddToCart = async () => {
    try {
      if (isProcessing) return;
      setProcessing(true);

      const res = await createCartItemMutation.mutateAsync({
        body: {
          productId: id as string,
          quantity: quantity,
        },
        token,
      });
      Alert.alert(
        "Thông báo",
        "Thêm sản phẩm vào giỏ thành công",
        [
          {
            text: "Mua tiếp",
            style: "cancel",
          },
          {
            text: "Trang chủ",
            onPress: () => {
              router.push("/(tabs)/home")
            },
            style: "destructive",
          },
        ]
      );
     
    } catch (e) {
      Alert.alert("Lỗi", `Không thêm được sản phẩm ${e}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
    } finally {
      setProcessing(false);
    }
  };

  // Đảm bảo productList là một chuỗi JSON hợp lệ
  if (typeof productDetail === "string") {
    try {
      parsedProductDetail = JSON.parse(
        decodeURIComponent(productDetail)
      ) as GetAllProductResType["data"][0];

      return (
        <View className="flex-1 bg-white">
          {/* Headers */}
          <View
            style={{ paddingTop: insets.top }}
            className="absolute top-0 left-0 right-0 z-10"
          >
            <View className="px-4 py-3 flex-row items-center justify-between">
              <Pressable
                onPress={() => router.push("/(root)/product/product")}
                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center ml-2"
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </Pressable>

              <View className="flex-row items-center">
                <CartButton bgColor="bg-black/30" iconColor="white" />
                <Pressable
                  className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2"
                  onPress={() => router.push("/notifications/notifications")}
                >
                  <MaterialIcons name="notifications" size={24} color="white" />
                </Pressable>
              </View>
            </View>
          </View>

          <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
            <Image
              source={{ uri: parsedProductDetail.images[0].imageUrl }}
              className="w-full h-56"
            />
            <View className="p-4">
              <View className="p-1">
                <View className="flex-row flex-wrap gap-2 mb-1">
                  {parsedProductDetail.categories.map((category) => (
                    <View
                      key={category.id}
                      className="bg-blue-50 px-3 py-1 rounded-full"
                    >
                      <Text className="text-blue-600 text-sm font-medium">
                        {category.name}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text className="font-bold mt-2 text-2xl" numberOfLines={2}>
                  {parsedProductDetail.name.length > 25
                    ? parsedProductDetail.name.substring(0, 25) + "..."
                    : parsedProductDetail.name}
                </Text>
                <Text className="text-gray-500 text-sm mt-1 mb-2">
                  {parsedProductDetail.description}
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
              className={`py-4 bg-blue-500 rounded-xl items-center ${
                isProcessing ? "opacity-70" : ""
              }`}
              onPress={handleAddToCart}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Thêm vào giỏ hàng •{" "}
                  {(parsedProductDetail.price * quantity).toLocaleString("vi-VN")} ₫
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      );
    } catch (error) {
      console.log("Lỗi ở product detail ", error);
      return (
        <View className="flex-1 bg-white">
          <HeaderWithBack
            title="Danh sách sản phẩm"
            returnTab={"/(root)/product/product"}
            showMoreOptions={false}
          />
          <View className="flex-1 items-center justify-center p-4">
            <MaterialIcons name="shopping-cart" size={34} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              Không tìm thấy thông tin sản phẩm
            </Text>
          </View>
        </View>
      );
    }
  } else {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title="Danh sách sản phẩm"
          returnTab={"/(root)/product/product"}
          showMoreOptions={false}
        />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="shopping-cart" size={34} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Không tìm thấy thông tin sản phẩm
          </Text>
        </View>
      </View>
    );
  }
}
