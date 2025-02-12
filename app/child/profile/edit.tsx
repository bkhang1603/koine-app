import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/child/HeaderWithBack";
import { MOCK_CHILD } from "@/constants/mock-data";

export default function EditProfileScreen() {
    const [formData, setFormData] = useState({
        name: MOCK_CHILD.name,
        email: "child@example.com",
        avatar: MOCK_CHILD.avatar,
    });

    const handleSave = () => {
        // Xử lý lưu thông tin
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Chỉnh sửa thông tin" />
            
            <ScrollView className="flex-1">
                {/* Avatar Section */}
                <View className="items-center py-6 bg-violet-50">
                    <View className="relative">
                        <Image 
                            source={{ uri: formData.avatar }} 
                            className="w-24 h-24 rounded-full"
                        />
                        <Pressable 
                            className="absolute bottom-0 right-0 w-8 h-8 bg-violet-500 rounded-full items-center justify-center"
                            onPress={() => {/* Handle avatar change */}}
                        >
                            <MaterialIcons name="camera-alt" size={20} color="white" />
                        </Pressable>
                    </View>
                </View>

                {/* Form */}
                <View className="p-4 space-y-4">
                    <View>
                        <Text className="text-gray-600 mb-1">Họ và tên</Text>
                        <TextInput
                            className="bg-gray-50 p-4 rounded-xl"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1">Email</Text>
                        <TextInput
                            className="bg-gray-50 p-4 rounded-xl"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <Pressable 
                    className="bg-violet-500 p-4 rounded-xl items-center"
                    onPress={handleSave}
                >
                    <Text className="text-white font-bold">
                        Lưu thay đổi
                    </Text>
                </Pressable>
            </View>
        </View>
    );
} 