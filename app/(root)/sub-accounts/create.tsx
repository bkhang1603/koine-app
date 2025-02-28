import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";

export default function CreateSubAccountScreen() {
    const [formData, setFormData] = useState({
        name: "",
        birthYear: "",
        gender: "" as "male" | "female" | "",
    });

    const handleCreate = () => {
        // TODO: Validate and create sub account
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Thêm tài khoản con" returnTab={"/(root)/purchased-courses/purchased-courses"}/>
            <ScrollView className="flex-1 p-4">
                {/* Form Fields */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2">Họ tên</Text>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4"
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
                            className="border border-gray-200 rounded-xl p-4"
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
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <Pressable
                    className={`p-4 rounded-xl ${
                        formData.name && formData.birthYear && formData.gender
                            ? "bg-blue-500"
                            : "bg-gray-100"
                    }`}
                    disabled={
                        !formData.name || !formData.birthYear || !formData.gender
                    }
                    onPress={handleCreate}
                >
                    <Text
                        className={`text-center font-bold ${
                            formData.name && formData.birthYear && formData.gender
                                ? "text-white"
                                : "text-gray-400"
                        }`}
                    >
                        Tạo tài khoản
                    </Text>
                </Pressable>
            </View>
        </View>
    );
} 