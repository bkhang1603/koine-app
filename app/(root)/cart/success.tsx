import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_USER } from "@/constants/mock-data";

export default function SuccessScreen() {
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <View className="items-center p-8">
                    <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
                        <MaterialIcons
                            name="check-circle"
                            size={48}
                            color="#059669"
                        />
                    </View>
                    <Text className="text-2xl font-bold text-center">
                        Thanh toán thành công!
                    </Text>
                    <Text className="text-gray-600 text-center mt-2">
                        Chọn người học để kích hoạt khóa học
                    </Text>
                </View>

                {/* Account Selection */}
                <View className="px-4">
                    {/* Main Account */}
                    <Pressable
                        className={`p-4 rounded-xl border mb-3 ${
                            selectedAccount === "main"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                        }`}
                        onPress={() => setSelectedAccount("main")}
                    >
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: MOCK_USER.avatar }}
                                className="w-12 h-12 rounded-full"
                            />
                            <View className="ml-3 flex-1">
                                <Text className="font-bold">
                                    {MOCK_USER.name}
                                </Text>
                                <Text className="text-gray-600">
                                    Tài khoản chính
                                </Text>
                            </View>
                            <MaterialIcons
                                name={
                                    selectedAccount === "main"
                                        ? "radio-button-checked"
                                        : "radio-button-unchecked"
                                }
                                size={24}
                                color={
                                    selectedAccount === "main"
                                        ? "#3B82F6"
                                        : "#9CA3AF"
                                }
                            />
                        </View>
                    </Pressable>

                    {/* Sub Accounts */}
                    {MOCK_USER.subAccounts.map((account) => (
                        <Pressable
                            key={account.id}
                            className={`p-4 rounded-xl border mb-3 ${
                                selectedAccount === account.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200"
                            }`}
                            onPress={() => setSelectedAccount(account.id)}
                        >
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: account.avatar }}
                                    className="w-12 h-12 rounded-full"
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="font-bold">
                                        {account.name}
                                    </Text>
                                    <Text className="text-gray-600">
                                        {2024 - account.birthYear} tuổi
                                    </Text>
                                </View>
                                <MaterialIcons
                                    name={
                                        selectedAccount === account.id
                                            ? "radio-button-checked"
                                            : "radio-button-unchecked"
                                    }
                                    size={24}
                                    color={
                                        selectedAccount === account.id
                                            ? "#3B82F6"
                                            : "#9CA3AF"
                                    }
                                />
                            </View>
                        </Pressable>
                    ))}

                    {/* Add Sub Account Button */}
                    <Pressable
                        className="flex-row items-center justify-center p-4 border border-dashed border-gray-200 rounded-xl"
                        onPress={() => router.push("/sub-accounts/create")}
                    >
                        <MaterialIcons
                            name="person-add"
                            size={24}
                            color="#3B82F6"
                        />
                        <Text className="ml-2 text-blue-500 font-medium">
                            Thêm tài khoản con
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <Pressable
                    className={`p-4 rounded-xl ${
                        selectedAccount
                            ? "bg-blue-500"
                            : "bg-gray-100"
                    }`}
                    disabled={!selectedAccount}
                    onPress={() => router.push("/my-courses")}
                >
                    <Text
                        className={`text-center font-bold ${
                            selectedAccount
                                ? "text-white"
                                : "text-gray-400"
                        }`}
                    >
                        Kích hoạt khóa học
                    </Text>
                </Pressable>
            </View>
        </View>
    );
} 