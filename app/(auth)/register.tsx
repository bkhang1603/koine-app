import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = () => {
        // Validate form
        if (!name || !email || !password || !confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp");
            return;
        }

        // Handle register logic here
        router.push("/(auth)/login");
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
                            <MaterialIcons
                                name="person-add"
                                size={40}
                                color="#2563EB"
                            />
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
                            <Text className="text-gray-600 mb-1">
                                Họ và tên
                            </Text>
                            <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                                <MaterialIcons
                                    name="person"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    className="flex-1 py-3 px-2"
                                    placeholder="Nhập họ và tên"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View>
                            <Text className="text-gray-600 mb-1">Email</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                                <MaterialIcons
                                    name="email"
                                    size={20}
                                    color="#6B7280"
                                />
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
                                <MaterialIcons
                                    name="lock"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    className="flex-1 py-3 px-2"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <Pressable
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    hitSlop={8}
                                >
                                    <MaterialIcons
                                        name={
                                            showPassword
                                                ? "visibility"
                                                : "visibility-off"
                                        }
                                        size={20}
                                        color="#6B7280"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View>
                            <Text className="text-gray-600 mb-1">
                                Xác nhận mật khẩu
                            </Text>
                            <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                                <MaterialIcons
                                    name="lock"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    className="flex-1 py-3 px-2"
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                />
                                <Pressable
                                    onPress={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    hitSlop={8}
                                >
                                    <MaterialIcons
                                        name={
                                            showConfirmPassword
                                                ? "visibility"
                                                : "visibility-off"
                                        }
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
                        <Text className="text-white font-bold text-center">
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
                            <Text className="text-blue-500 font-medium">
                                Đăng nhập
                            </Text>
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
