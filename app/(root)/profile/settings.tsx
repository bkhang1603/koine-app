import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderWithBack from "@/components/HeaderWithBack";

const SETTINGS_SECTIONS = [
    {
        title: "Tài khoản",
        items: [
            {
                id: "profile",
                title: "Thông tin cá nhân",
                icon: "person",
                action: () => router.push("/profile/edit"),
            },
            {
                id: "password",
                title: "Đổi mật khẩu",
                icon: "lock",
                action: () => router.push("/profile/change-password"),
            },
        ],
    },
    {
        title: "Thông báo",
        items: [
            {
                id: "notifications",
                title: "Cài đặt thông báo",
                icon: "notifications",
                action: () => {},
            },
            {
                id: "email",
                title: "Thông báo qua email",
                icon: "email",
                action: () => {},
            },
        ],
    },
    {
        title: "Khác",
        items: [
            {
                id: "about",
                title: "Về chúng tôi",
                icon: "info",
                action: () => {},
            },
            {
                id: "privacy",
                title: "Chính sách bảo mật",
                icon: "privacy-tip",
                action: () => {},
            },
            {
                id: "terms",
                title: "Điều khoản sử dụng",
                icon: "description",
                action: () => {},
            },
            {
                id: "help",
                title: "Trợ giúp & Hỗ trợ",
                icon: "help",
                action: () => {},
            },
        ],
    },
];

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderWithBack title="Cài đặt" />

            <ScrollView>
                <View className="p-4 space-y-6">
                    {SETTINGS_SECTIONS.map((section) => (
                        <View key={section.title}>
                            <Text className="text-sm font-medium text-gray-500 mb-2">
                                {section.title}
                            </Text>
                            <View className="bg-white rounded-xl overflow-hidden">
                                {section.items.map((item, index) => (
                                    <Pressable
                                        key={item.id}
                                        onPress={item.action}
                                        className={`flex-row items-center p-4 ${
                                            index !== section.items.length - 1
                                                ? "border-b border-gray-100"
                                                : ""
                                        }`}
                                    >
                                        <MaterialIcons
                                            name={item.icon as any}
                                            size={24}
                                            color="#4B5563"
                                        />
                                        <Text className="flex-1 text-gray-700 ml-3">
                                            {item.title}
                                        </Text>
                                        <MaterialIcons
                                            name="chevron-right"
                                            size={24}
                                            color="#9CA3AF"
                                        />
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ))}

                    <Pressable
                        className="bg-red-50 p-4 rounded-xl flex-row items-center mt-6"
                        onPress={() => {
                            // Handle logout
                            router.push("/login");
                        }}
                    >
                        <MaterialIcons name="logout" size={24} color="#EF4444" />
                        <Text className="text-red-500 ml-3 font-medium">
                            Đăng xuất
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
} 