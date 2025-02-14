import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/components/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useLoginMutation } from "@/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { RoleValues } from "@/constants/type";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { showModal: queryShowModal, expired } = useLocalSearchParams();

  const signIn = useLoginMutation();
  const setUser = useAppStore((state) => state.setUser);
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const setAccessExpired = useAppStore((state) => state.setAccessExpired);
  const setRefreshToken = useAppStore((state) => state.setRefreshToken);
  const setRefreshExpired = useAppStore((state) => state.setRefreshExpired);

  useEffect(() => {
    if (queryShowModal === "true") {
      if (expired === "true") {
        setModalMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (expired === "false") {
        setModalMessage("Tài khoản đã được đăng nhập ở nơi khác.");
      } else {
        setModalMessage("Vui lòng đăng nhập lại.");
      }

      setShowModal(true);

      // Tự động đóng modal sau 5 giây
      const timeout = setTimeout(() => {
        setShowModal(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [queryShowModal, expired]);

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      const res = await signIn.mutateAsync({
        loginKey: email,
        password: password,
      });
      if (res?.statusCode == 200) {
        const {
          accessToken,
          refreshToken,
          expiresAccess,
          expiresRefresh,
          account,
        } = res.data;
        setUser(account);
        setAccessToken({ accessToken, expiresAccess });
        setRefreshToken({ refreshToken, expiresRefresh });
        setAccessExpired(false);
        setRefreshExpired(false);

        // Lưu thông tin người dùng vào SecureStore
        const userString = JSON.stringify(res.data);
        await SecureStore.setItemAsync("loginData", userString); // Lưu trữ vào SecureStore

        if (account.role == RoleValues[0]) {
          router.push("/adult/(tabs)/home");
        } else if (account.role == RoleValues[3]) {
          router.push("/child/(tabs)/home");
        }
      } else if (res?.statusCode == 400) {
        alert("Tài khoản chưa được kích hoạt");
      } else if (res?.statusCode == 404) {
        alert("Tài khoản không tồn tại hoặc sai tài khoản mật khẩu");
      } else {
        alert("Lỗi máy chủ. Vui lòng thử lại sau!");
      }
    } catch (error) {
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
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo */}
          <View className="items-center my-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
              <MaterialIcons name="person" size={40} color="#2563EB" />
            </View>
          </View>

          {/* Title */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800">Đăng nhập</Text>
            <Text className="text-gray-500 mt-2">
              Vui lòng đăng nhập để tiếp tục
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email Input */}
            <View>
              <Text className="text-gray-600 mb-1">Tài khoản</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                <MaterialIcons name="email" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-2"
                  placeholder="Nhập email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-600 mb-1">Mật khẩu</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                <MaterialIcons name="lock" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-2"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>

            {/* Forgot Password */}
            <Pressable
              className="self-end"
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Text className="text-blue-500">Quên mật khẩu?</Text>
            </Pressable>
          </View>

          {/* Login Button */}
          <Pressable
            className="bg-blue-500 p-4 rounded-xl mt-8"
            onPress={handleLogin}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Text className="text-white font-bold text-center">Đăng nhập</Text>
          </Pressable>

          {/* Register Link */}
          <Pressable
            className="mt-4"
            onPress={() => router.push("/auth/register")}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Text className="text-center text-gray-600">
              Chưa có tài khoản?{" "}
              <Text className="text-blue-500 font-medium">Đăng ký</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
