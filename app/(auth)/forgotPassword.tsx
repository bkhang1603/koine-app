import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useForgotPasswordMutation } from "@/queries/useAuth";

export default function ForgotPasswordScreen() {
  const forgot = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleForgotPassword = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      if (email.trim().length <= 10 || !email.includes("@gmail.com")) {
        Alert.alert("Thông báo", "Email không hợp lệ!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
        return;
      }

      Keyboard.dismiss();
      const res = await forgot.mutateAsync({
        body: { email: email.trim() },
      });
      if (res) {
        Alert.alert("Thông báo", "Kiểm tra email để nhận mật khẩu mới", [
          {
            text: "Đăng nhập",
            onPress: async () => {
              setIsProcessing(false);
              router.push("/(auth)/login");
            },
            style: "cancel",
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Lỗi", `Email không tồn tại`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
      setIsProcessing(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >

          {/* Creative Header Design */}
          <View className="h-72">
            <View className="absolute top-0 left-0 right-0 h-88 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-b-[50px]" />

            <View className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 opacity-20 rounded-full -mr-10 -mt-10" />
            <View className="absolute top-20 left-0 w-20 h-20 bg-blue-300 opacity-20 rounded-full -ml-10" />

            <View className="relative pt-12 items-center">
              <View className="bg-white p-4 rounded-2xl shadow-xl">
                <Image
                  source={require("../../assets/images/logoKoine.png")}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
              </View>

              <Text className="text-gray-600 text-center px-10 text-base mt-1">
                Chúng tôi sẽ gửi mật khẩu mới của tài khoản qua email
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <View className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 flex-1">
              {/* Form */}
              <View className="space-y-5 flex-1">
                {/* Email Input */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2 ml-1">
                    Email
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                    <MaterialIcons name="email" size={20} color="#6B7280" />
                    <TextInput
                      className="flex-1 py-3.5 px-3"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>


                {/* Login Button */}
                <Pressable
                  className={`${
                    !isProcessing && email.trim().length != 0 
                      ? "bg-blue-600"
                      : "bg-gray-600 active:bg-blue-700"
                  } py-4 rounded-2xl mt-4 items-center justify-center shadow-sm`}
                  onPress={handleForgotPassword}
                  disabled={isProcessing || email.trim().length != 0 ? false : true}
                >
                  <Text className="text-white font-bold text-base">
                    {isProcessing ? "Đang xử lý..." : "Gửi email"}
                  </Text>
                </Pressable>

                {/* Divider */}
                <View className="flex-row items-center">
                  <View className="flex-1 h-[1px] bg-gray-200" />
                  <Text className="mx-4 text-gray-500">Hoặc</Text>
                  <View className="flex-1 h-[1px] bg-gray-200" />
                </View>

                {/* Register Link - Moved to bottom */}
                <Pressable
                  className="mt-4"
                  onPress={() => router.push("/(auth)/login")}
                >
                  <Text className="text-center text-gray-600">
                    Bạn đã nhớ mật khẩu?{" "}
                    <Text className="text-blue-600 font-medium">
                      Đăng nhập ngay
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
