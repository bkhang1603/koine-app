import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { useAppStore } from "@/components/app-provider";
import { RoleValues } from "@/constants/type";

export default function Index() {
  const isRefreshExpired = useAppStore((state) => state.isRefreshExpired);
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useAppStore((state) => state.user);

  const handlePress = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (isRefreshExpired || !user) {
      router.push("/(auth)/login");
    } else {
      if (user.role == RoleValues[0]) {
        // router.push(
        //   "/(root)/learn/question/34518330-359b-40cf-9ec0-1ab29d0e0c65"
        // );
        router.push("/(tabs)/home");
      } else if (user.role == RoleValues[3]) {
        router.push("/child/(tabs)/home");
      } else if (user.role == RoleValues[1]) {
        router.push("/(expert)/menu/home");
      }
    }
    setTimeout(() => setIsProcessing(false), 1000);
  };

  return (
    <ImageBackground
      source={require("./../assets/images/login.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* Top Section */}
          <View className="mt-16 mx-6">
            <View className="bg-white/20 backdrop-blur-sm p-3 rounded-full self-start">
              <Text className="text-white text-3xl font-bold px-2">Koine</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View className="mt-auto px-0 pb-0">
            <View className="bg-white/90 backdrop-blur-md p-6 rounded-t-3xl shadow-2xl">
              <View className="items-center mb-6">
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4">
                  <Image
                    source={require("./../assets/images/logoKoine.png")}
                    className="w-12 h-12"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-800 text-center">
                  Chào mừng đến với Koine
                </Text>
                <Text className="text-gray-600 text-base text-center mt-2">
                  Nơi kết nối và phát triển kỹ năng của trẻ
                </Text>
              </View>

              <View className="space-y-4">
                <TouchableOpacity
                  onPress={handlePress}
                  disabled={isProcessing}
                  className={`py-4 rounded-xl ${
                    isProcessing ? "bg-blue-400" : "bg-blue-600"
                  } shadow-md`}
                >
                  <Text className="text-center text-white font-bold text-lg">
                    {isProcessing ? "Đang xử lý..." : "Bắt đầu ngay"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/(auth)/register")}
                  className="py-4 bg-transparent border border-blue-600 rounded-xl"
                >
                  <Text className="text-center text-blue-600 font-bold">
                    Tạo tài khoản mới
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-center mt-6 text-xs text-gray-500">
                Bằng cách tiếp tục, bạn đồng ý với các{" "}
                <Text className="text-blue-600">điều khoản</Text> và{" "}
                <Text className="text-blue-600">chính sách</Text> của chúng tôi.
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
