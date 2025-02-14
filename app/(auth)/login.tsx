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

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }
        router.push("/(tabs)");
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
                        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
                            <MaterialIcons
                                name="person"
                                size={40}
                                color="#2563EB"
                            />
                        </View>
                    </View>

                    {/* Title */}
                    <View className="mb-8">
                        <Text className="text-2xl font-bold text-gray-800">
                            Đăng nhập
                        </Text>
                        <Text className="text-gray-500 mt-2">
                            Vui lòng đăng nhập để tiếp tục
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
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
                            <Text className="text-blue-500">
                                Quên mật khẩu?
                            </Text>
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
                        <Text className="text-white font-bold text-center">
                            Đăng nhập
                        </Text>
                    </Pressable>

                    {/* Register Link */}
                    <Pressable
                        className="mt-4"
                        onPress={() => router.push("/(auth)/register")}
                        hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10,
                        }}
                    >
                        <Text className="text-center text-gray-600">
                            Chưa có tài khoản?{" "}
                            <Text className="text-blue-500 font-medium">
                                Đăng ký
                            </Text>
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
