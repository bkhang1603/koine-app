import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_USER } from "@/constants/mock-data";

export default function EditSubAccountScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const account = MOCK_USER.subAccounts.find((acc) => acc.id === id);

    const [formData, setFormData] = useState({
        name: account?.name || "",
        birthYear: account?.birthYear.toString() || "",
        gender: account?.gender || ("" as "male" | "female" | ""),
        avatar: account?.avatar || "",
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = () => {
        // TODO: Save changes
        router.back();
    };

    const handleDelete = () => {
        // TODO: Delete account
        router.back();
    };

    if (!account) return null;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Chỉnh sửa tài khoản" />
            <ScrollView className="flex-1">
                {/* Avatar Section */}
                <View className="items-center py-6 bg-blue-50">
                    <View className="relative">
                        <Image
                            source={{ uri: formData.avatar }}
                            className="w-24 h-24 rounded-full"
                        />
                        <Pressable
                            className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                            onPress={() => {/* TODO: Change avatar */}}
                        >
                            <MaterialIcons name="camera-alt" size={20} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                {/* Form Fields */}
                <View className="p-4 space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2">Họ tên</Text>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 bg-white"
                            placeholder="Nhập họ tên"
                            value={formData.name}
                            onChangeText={(text) =>
                                setFormData({ ...formData, name: text })
                            }
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2">Năm sinh</Text>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 bg-white"
                            placeholder="Nhập năm sinh"
                            keyboardType="number-pad"
                            value={formData.birthYear}
                            onChangeText={(text) =>
                                setFormData({ ...formData, birthYear: text })
                            }
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2">Giới tính</Text>
                        <View className="flex-row space-x-4">
                            <Pressable
                                className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                                    formData.gender === "male"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200"
                                }`}
                                onPress={() =>
                                    setFormData({ ...formData, gender: "male" })
                                }
                            >
                                <MaterialIcons
                                    name="male"
                                    size={24}
                                    color={
                                        formData.gender === "male"
                                            ? "#3B82F6"
                                            : "#6B7280"
                                    }
                                />
                                <Text
                                    className={`ml-2 font-medium ${
                                        formData.gender === "male"
                                            ? "text-blue-500"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Nam
                                </Text>
                            </Pressable>
                            <Pressable
                                className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border ${
                                    formData.gender === "female"
                                        ? "border-pink-500 bg-pink-50"
                                        : "border-gray-200"
                                }`}
                                onPress={() =>
                                    setFormData({ ...formData, gender: "female" })
                                }
                            >
                                <MaterialIcons
                                    name="female"
                                    size={24}
                                    color={
                                        formData.gender === "female"
                                            ? "#EC4899"
                                            : "#6B7280"
                                    }
                                />
                                <Text
                                    className={`ml-2 font-medium ${
                                        formData.gender === "female"
                                            ? "text-pink-500"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Nữ
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Learning Info */}
                    <View className="bg-gray-50 p-4 rounded-xl mt-4">
                        <Text className="font-bold mb-3">Thông tin học tập</Text>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">Khóa học đang học</Text>
                            <Text className="font-medium">{account.activeCourses.length}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Ngày tạo tài khoản</Text>
                            <Text className="font-medium">15/03/2024</Text>
                        </View>
                    </View>

                    {/* Danger Zone */}
                    <View className="mt-8">
                        <Text className="text-red-500 font-bold mb-3">Vùng nguy hiểm</Text>
                        <Pressable
                            className="border border-red-200 p-4 rounded-xl"
                            onPress={() => setShowDeleteConfirm(true)}
                        >
                            <View className="flex-row items-center">
                                <MaterialIcons
                                    name="delete-outline"
                                    size={24}
                                    color="#EF4444"
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="text-red-500 font-medium">
                                        Xóa tài khoản
                                    </Text>
                                    <Text className="text-gray-500 text-sm mt-1">
                                        Hành động này không thể hoàn tác
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <Pressable
                    className="bg-blue-500 p-4 rounded-xl"
                    onPress={handleSave}
                >
                    <Text className="text-white font-bold text-center">
                        Lưu thay đổi
                    </Text>
                </Pressable>
            </View>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <View className="bg-white m-4 p-4 rounded-2xl w-full max-w-sm">
                        <Text className="text-lg font-bold mb-2">
                            Xác nhận xóa tài khoản
                        </Text>
                        <Text className="text-gray-600 mb-4">
                            Bạn có chắc chắn muốn xóa tài khoản này? Tất cả dữ liệu học tập sẽ bị mất.
                        </Text>
                        <View className="flex-row space-x-3">
                            <Pressable
                                className="flex-1 p-4 bg-gray-100 rounded-xl"
                                onPress={() => setShowDeleteConfirm(false)}
                            >
                                <Text className="text-center font-medium text-gray-700">
                                    Hủy
                                </Text>
                            </Pressable>
                            <Pressable
                                className="flex-1 p-4 bg-red-500 rounded-xl"
                                onPress={handleDelete}
                            >
                                <Text className="text-center font-medium text-white">
                                    Xóa
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
} 