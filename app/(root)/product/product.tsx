import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import HeaderWithBack from "@/components/HeaderWithBack";
import { GetAllProductResType } from "@/schema/product-schema";

export default function ProductsScreen() {
  const { productList } = useLocalSearchParams();

  let parsedProductList: GetAllProductResType["data"] = [];
  // Đảm bảo productList là một chuỗi JSON hợp lệ
  if (typeof productList === "string") {
    try {
      parsedProductList = JSON.parse(
        decodeURIComponent(productList)
      ) as GetAllProductResType["data"];
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <HeaderWithBack
        title="Danh sách sản phẩm"
        returnTab={"/(tabs)/home"}
        showMoreOptions={false}
      />

      {parsedProductList.length === 0 ? (
        <Text>Danh sách trống</Text>
      ) : (
        <Text>Product list ({parsedProductList.length} sản phẩm)</Text>
      )}
    </View>
  );
}
