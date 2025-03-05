import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRegisterMutation } from "@/queries/useAuth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dob, setDob] = useState("2000-10-20");
  const [date, setDate] = useState(new Date(2000, 9, 20));
  const [show, setShow] = useState(false);

  const register = useRegisterMutation();

  function convertDateFormat(dateStr: string): string {
    // Tạo Date object từ chuỗi ISO 8601
    const [month, day, year] = dateStr.split("/");
    return `${day}/${month}/${year}`;
  }

  function convertToSubmit(dateStr: string): string {
    // Tạo Date object từ chuỗi ISO 8601
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === "ios"); // Ẩn picker nếu là Android
    if (!selectedDate) return;
    setDate(selectedDate);
    const submitDate = convertDateFormat(selectedDate.toLocaleDateString());
    setDob(submitDate);
  };

  const handleRegister = async () => {
    try {
      // Validate form
      if (
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim() ||
        !dob ||
        !gender.trim() ||
        !address.trim()
      ) {
        Alert.alert(
          "Lỗi",
          "Vui lòng nhập đầy đủ thông tin, không được để trống!",
          [
            {
              text: "tắt",
              style: "cancel",
            },
          ]
        );
        setIsProcessing(false);
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
        return;
      }

      const body = {
        email: email.trim(),
        username: name.trim(),
        password: password.trim(),
        gender: gender,
        address: address.trim(),
        dob: convertToSubmit(dob).trim(),
        role: "ADULT",
      };
      console.log(body);
      setIsProcessing(false);
      //   const res = await register.mutateAsync(body);
      //   if (res) {
      //     Alert.alert(
      //       "Thông báo",
      //       "Đăng kí thành công, kiểm tra mail để lấy mã xác nhận",
      //       [
      //         {
      //           text: "tắt",
      //           style: "cancel",
      //         },
      //       ]
      //     );
      //     setIsProcessing(false);
      //     //router.push qua trang nhập otp
      //   }
    } catch (error) {
      Alert.alert("Lỗi", `${error}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
      setIsProcessing(false);
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
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo */}
          <View className="items-center my-8">
            {/* Tạm thời sử dụng icon thay cho logo */}
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
              <MaterialIcons name="person-add" size={40} color="#2563EB" />
            </View>
          </View>

          {/* Title */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800">
              Đăng ký tài khoản
            </Text>
            <Text className="text-gray-500 mt-2">
              Vui lòng điền đầy đủ thông tin bên dưới
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-gray-600 mb-1">Tên đăng nhập</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                <MaterialIcons name="person" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-2"
                  placeholder="Nhập tên đăng nhập"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-gray-600 mb-1">Email</Text>
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

            <View>
              <Text className="text-gray-600 mb-1">Email</Text>
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

            {/* Địa chỉ Input */}
            <View>
              <Text className="text-gray-600 mb-1">Địa chỉ</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                <MaterialIcons name="lock" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-2"
                  placeholder="Nhập địa chỉ"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Ngày sinh</Text>
              <View className="flex-row items-center">
                <View className="border border-gray-200 p-4 rounded-xl">
                  <Text className="text-black font-bold text-center">
                    {date.toLocaleDateString()}
                  </Text>
                </View>
                <Pressable
                  className="bg-cyan-200 p-2 rounded-xl ml-3"
                  onPress={() => setShow(true)}
                >
                  <MaterialIcons
                    name="calendar-month"
                    size={24}
                    color="black"
                  />
                </Pressable>
              </View>

              {show && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Giới tính</Text>
              <View className="flex-row space-x-4">
                <Pressable
                  className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                    gender === "MALE"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onPress={() => setGender("MALE")}
                >
                  <MaterialIcons
                    name="male"
                    size={24}
                    color={gender === "MALE" ? "#3B82F6" : "#6B7280"}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      gender === "MALE" ? "text-blue-500" : "text-gray-600"
                    }`}
                  >
                    Nam
                  </Text>
                </Pressable>
                <Pressable
                  className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                    gender === "FEMALE"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"
                  }`}
                  onPress={() => setGender("FEMALE")}
                >
                  <MaterialIcons
                    name="female"
                    size={24}
                    color={gender === "FEMALE" ? "#EC4899" : "#6B7280"}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      gender === "FEMALE" ? "text-pink-500" : "text-gray-600"
                    }`}
                  >
                    Nữ
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-gray-600 mb-1">Xác nhận mật khẩu</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                <MaterialIcons name="lock" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-2"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showConfirmPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            className="bg-blue-500 p-4 rounded-xl mt-8"
            onPress={handleRegister}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Text
              className="text-white font-bold text-center"
              onPress={handleRegister}
            >
              Đăng ký
            </Text>
          </Pressable>

          {/* Login Link */}
          <Pressable
            className="mt-4"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-center text-gray-600">
              Đã có tài khoản?{" "}
              <Text className="text-blue-500 font-medium">Đăng nhập</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
