import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/components/auth";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const insets = useSafeAreaInsets();
    const { login } = useAuth();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
            >
                <View className="flex-1 px-4 pt-12">
                    {/* Header */}
                    <View className="items-center mb-12">
                        <Text className="text-3xl font-bold text-blue-500 mb-2">
                            Chào mừng trở lại
                        </Text>
                        <Text className="text-gray-600 text-center">
                            Đăng nhập để tiếp tục học tập và phát triển
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-700 mb-2">Email</Text>
                            <TextInput
                                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-2">Mật khẩu</Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable
                                    className="absolute right-4 top-4"
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <MaterialIcons
                                        name={
                                            showPassword
                                                ? "visibility"
                                                : "visibility-off"
                                        }
                                        size={24}
                                        color="#6B7280"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <Link href="/forgot-password" asChild>
                            <Pressable>
                                <Text className="text-blue-500 text-right">
                                    Quên mật khẩu?
                                </Text>
                            </Pressable>
                        </Link>

                        <Pressable 
                            className="bg-blue-500 p-4 rounded-xl"
                            onPress={() => login(email, password)}
                        >
                            <Text className="text-white text-center font-bold text-lg">
                                Đăng nhập
                            </Text>
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <View className="mt-8">
                        <Text className="text-center text-gray-600">
                            Chưa có tài khoản?{" "}
                            <Link href="/register" className="text-blue-500">
                                Đăng ký ngay
                            </Link>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
} 