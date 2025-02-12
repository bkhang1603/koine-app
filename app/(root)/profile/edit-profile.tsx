import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_ACCOUNTS } from "@/constants/mock-data";
import HeaderWithBack from "@/components/HeaderWithBack";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
    const parent = MOCK_ACCOUNTS.find((acc) => acc.role === "parent");
    const [avatar, setAvatar] = useState(parent?.avatar);
    const [name, setName] = useState(parent?.name || "");
    const [email, setEmail] = useState(parent?.email || "");
    const [phone, setPhone] = useState("0123456789"); // Thêm vào mock data

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Chỉnh sửa hồ sơ" />

            <ScrollView className="flex-1 p-4">
                {/* Avatar Section */}
                <View className="items-center mb-8">
                    <View className="relative">
                        <Image
                            source={{ uri: avatar }}
                            className="w-24 h-24 rounded-full"
                        />
                        <Pressable
                            className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                            onPress={pickImage}
                        >
                            <MaterialIcons
                                name="camera-alt"
                                size={18}
                                color="white"
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Form Fields */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-600 mb-1">Họ và tên</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            className="bg-gray-50 p-4 rounded-xl text-gray-700"
                            placeholder="Nhập họ và tên"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1">Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            className="bg-gray-50 p-4 rounded-xl text-gray-700"
                            placeholder="Nhập email"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1">Số điện thoại</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            className="bg-gray-50 p-4 rounded-xl text-gray-700"
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <Pressable
                    className="bg-blue-500 p-4 rounded-xl mt-8"
                    onPress={() => {
                        // Handle save changes
                        router.back();
                    }}
                >
                    <Text className="text-white font-bold text-center">
                        Lưu thay đổi
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
} 