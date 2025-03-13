import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useOrder } from "@/queries/useOrder";
import { GetAllOrderResType, orderRes } from "@/schema/order-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";

export default function ProductsScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <HeaderWithBack
        title="Danh sách sản phẩm"
        returnTab={"/(tabs)/home"}
        showMoreOptions={false}
      />

      <Text>Product list</Text>
    </View>
  );
}
