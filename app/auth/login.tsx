import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_ACCOUNTS } from "@/constants/mock-data";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const insets = useSafeAreaInsets();

    const handleLogin = () => {
        const account = MOCK_ACCOUNTS.find(
            (acc) =>
                acc.email === formData.email &&
                acc.password === formData.password
        );

        if (account) {
            // TODO: Set global auth state
            if (account.role === "parent") {
                router.replace("/(tabs)" as any);
            } else {
                router.replace("/child/(tabs)" as any);
            }
        } else {
            // TODO: Show error
        }
    };

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
                    backgroundColor: "white",
                }}
            >
                <View className="flex-1 bg-white p-6">
                    <View className="flex-1 justify-center">
                        <View className="items-center mb-8">
                            <View className="w-20 h-20 bg-blue-100 rounded-2xl items-center justify-center mb-4">
                                <MaterialIcons
                                    name="school"
                                    size={40}
                                    color="#3B82F6"
                                />
                            </View>
                            <Text className="text-2xl font-bold">
                                Đăng nhập
                            </Text>
                            <Text className="text-gray-500 mt-2">
                                Đăng nhập để tiếp tục
                            </Text>
                        </View>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-700 mb-2">
                                    Email
                                </Text>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-4"
                                    placeholder="Nhập email"
                                    value={formData.email}
                                    onChangeText={(text) =>
                                        setFormData({
                                            ...formData,
                                            email: text,
                                        })
                                    }
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 mb-2">
                                    Mật khẩu
                                </Text>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-4"
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChangeText={(text) =>
                                        setFormData({
                                            ...formData,
                                            password: text,
                                        })
                                    }
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <Pressable
                            className="bg-blue-500 p-4 rounded-xl mt-8"
                            onPress={handleLogin}
                        >
                            <Text className="text-white font-bold text-center">
                                Đăng nhập
                            </Text>
                        </Pressable>

                        <View className="flex-row items-center justify-center mt-6">
                            <Text className="text-gray-600">
                                Chưa có tài khoản?
                            </Text>
                            <Pressable
                                className="ml-2"
                                onPress={() => router.push("/register")}
                            >
                                <Text className="text-blue-500 font-bold">
                                    Đăng ký
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Test Account Info */}
                    <View className="border-t border-gray-100 pt-4 mt-8">
                        <Text className="text-gray-500 text-center mb-2">
                            Tài khoản test:
                        </Text>
                        <Text className="text-gray-600 text-center">
                            Parent: parent@example.com / 123456
                        </Text>
                        <Text className="text-gray-600 text-center">
                            Child: child1@example.com / 123456
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
