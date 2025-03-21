import React, { useState, useRef, useEffect } from "react";
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
  Alert,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useConfirmOtpMutation } from "@/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import * as SecureStore from "expo-secure-store";
import { RoleValues } from "@/constants/type";

export default function OTPConfirmationScreen() {
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const confirmOtp = useConfirmOtpMutation();
  const setUser = useAppStore((state) => state.setUser);
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const setRefreshToken = useAppStore((state) => state.setRefreshToken);
  const setAccessExpired = useAppStore((state) => state.setAccessExpired);
  const setRefreshExpired = useAppStore((state) => state.setRefreshExpired);

  useEffect(() => {
    // Start countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto focus next input if text was entered
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      if (isProcessing) return;

      const otpCode = otp.join("");
      if (otpCode.length !== 6) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP!");
        return;
      }

      setIsProcessing(true);
      Keyboard.dismiss();

      console.log("Sending OTP verification request:", {
        id: userId,
        code: otpCode,
      });

      const res = await confirmOtp.mutateAsync({
        id: userId,
        code: otpCode,
      });

      console.log("OTP verification response:", res);

      if (res?.statusCode === 200) {
        Alert.alert("Thành công", "Tài khoản đã được kích hoạt thành công!", [
          {
            text: "Đăng nhập ngay",
            onPress: () => {
              router.push("/(auth)/login");
              setTimeout(() => setIsProcessing(false), 1000);
            },
          },
        ]);
      }
    } catch (error: any) {
      console.log("OTP verification error details:", error);

      // Log more detailed error information
      if (error.response) {
        // Server trả về response với status code khác 2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);

        Alert.alert(
          "Lỗi",
          `Mã OTP không chính xác hoặc đã hết hạn! (${error.response.status})`
        );
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được response
        console.log("Error request:", error.request);
        Alert.alert(
          "Lỗi kết nối",
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!"
        );
      } else {
        // Lỗi khi thiết lập request
        console.log("Error message:", error.message);
        Alert.alert("Lỗi", `Đã xảy ra lỗi: ${error.message}`);
      }

      setIsProcessing(false);
    }
  };

  const handleResendOTP = () => {
    // API call to resend OTP would go here
    // Thêm API call ở đây để gửi lại OTP
    Alert.alert("Thông báo", "Mã OTP mới đã được gửi!");
    setTimeLeft(300);
    // Reset OTP input
    setOtp(["", "", "", "", "", ""]);
    // Focus first input
    inputRefs.current[0]?.focus();
  };

  // Cập nhật hiển thị đếm ngược để hiển thị phút và giây
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View className="bg-blue-50 rounded-b-[40px] pt-8 pb-12 mb-6">
            <View className="items-center">
              <View className="w-20 h-20 bg-white rounded-2xl shadow-md items-center justify-center mb-4">
                <Image
                  source={require("../../assets/images/logoKoine.png")}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-bold text-gray-800">
                Xác thực OTP
              </Text>
              <Text className="text-gray-600 mt-2 text-center px-6">
                Vui lòng nhập mã OTP đã được gửi vào email của bạn
              </Text>
            </View>
          </View>

          <View className="px-6 flex-1">
            {/* OTP input fields */}
            <View className="mt-6">
              <Text className="text-gray-700 text-center mb-8">
                Nhập mã 6 số được gửi đến email của bạn
              </Text>

              <View className="flex-row justify-between px-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-12 h-14 bg-gray-50 rounded-lg text-center text-xl font-bold border border-gray-200"
                    maxLength={1}
                    keyboardType="number-pad"
                    value={otp[index]}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
              </View>
            </View>

            {/* Timer & Resend */}
            <View className="mt-8 items-center">
              <Text className="text-gray-600 mb-2">
                {timeLeft > 0
                  ? `Mã OTP sẽ hết hạn sau ${formatTime(timeLeft)}`
                  : "Mã OTP đã hết hạn"}
              </Text>

              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={timeLeft > 0}
                className={`py-2 ${
                  timeLeft > 0 ? "opacity-50" : "opacity-100"
                }`}
              >
                <Text
                  className={`${
                    timeLeft > 0 ? "text-gray-400" : "text-blue-600"
                  } font-medium`}
                >
                  Gửi lại mã OTP
                </Text>
              </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <View className="mt-auto mb-8">
              <Pressable
                className={`py-4 rounded-2xl shadow-sm ${
                  isProcessing || otp.join("").length !== 6
                    ? "bg-gray-200"
                    : "bg-blue-600"
                }`}
                onPress={handleVerify}
                disabled={isProcessing || otp.join("").length !== 6}
              >
                <Text
                  className={`text-center font-bold text-base ${
                    isProcessing || otp.join("").length !== 6
                      ? "text-gray-400"
                      : "text-white"
                  }`}
                >
                  {isProcessing ? "Đang xử lý..." : "Xác nhận"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
