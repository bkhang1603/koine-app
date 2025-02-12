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
import { Link, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const insets = useSafeAreaInsets();

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
                            Tạo tài khoản mới
                        </Text>
                        <Text className="text-gray-600 text-center">
                            Bắt đầu hành trình học tập của bạn
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-700 mb-2">Họ và tên</Text>
                            <TextInput
                                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                placeholder="Nhập họ và tên của bạn"
                                value={formData.name}
                                onChangeText={(text) =>
                                    setFormData({ ...formData, name: text })
                                }
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-2">Email</Text>
                            <TextInput
                                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChangeText={(text) =>
                                    setFormData({ ...formData, email: text })
                                }
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-2">Mật khẩu</Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                    placeholder="Tạo mật khẩu"
                                    value={formData.password}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, password: text })
                                    }
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

                        <View>
                            <Text className="text-gray-700 mb-2">
                                Xác nhận mật khẩu
                            </Text>
                            <TextInput
                                className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChangeText={(text) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: text,
                                    })
                                }
                                secureTextEntry={!showPassword}
                            />
                        </View>

                        <Pressable 
                            className="bg-blue-500 p-4 rounded-xl mt-6"
                            onPress={() => {
                                // Handle registration
                                router.push("/(tabs)");
                            }}
                        >
                            <Text className="text-white text-center font-bold text-lg">
                                Đăng ký
                            </Text>
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <View className="mt-8">
                        <Text className="text-center text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link href="/login" className="text-blue-500">
                                Đăng nhập
                            </Link>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
} 