import React from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/child/HeaderWithBack";

export default function SettingsScreen() {
    const [notifications, setNotifications] = React.useState(true);
    const [sound, setSound] = React.useState(true);
    const [vibration, setVibration] = React.useState(true);

    const SETTINGS_SECTIONS = [
        {
            title: "Thông báo",
            items: [
                {
                    id: "notifications",
                    title: "Thông báo",
                    description: "Nhận thông báo về bài học mới",
                    type: "switch",
                    value: notifications,
                    onValueChange: setNotifications,
                },
                {
                    id: "sound",
                    title: "Âm thanh",
                    description: "Bật/tắt âm thanh trong ứng dụng",
                    type: "switch",
                    value: sound,
                    onValueChange: setSound,
                },
                {
                    id: "vibration",
                    title: "Rung",
                    description: "Bật/tắt rung khi có thông báo",
                    type: "switch",
                    value: vibration,
                    onValueChange: setVibration,
                },
            ],
        },
        {
            title: "Tài khoản",
            items: [
                {
                    id: "profile",
                    title: "Thông tin cá nhân",
                    description: "Cập nhật thông tin của bạn",
                    type: "link",
                    icon: "person",
                    onPress: () => router.push("/child/profile/edit"),
                },
                {
                    id: "password",
                    title: "Đổi mật khẩu",
                    description: "Thay đổi mật khẩu đăng nhập",
                    type: "link",
                    icon: "lock",
                    onPress: () => router.push("/child/profile/change-password"),
                },
            ],
        },
        {
            title: "Khác",
            items: [
                {
                    id: "help",
                    title: "Trợ giúp",
                    description: "Xem hướng dẫn sử dụng",
                    type: "link",
                    icon: "help",
                    onPress: () => router.push("/child/help"),
                },
                {
                    id: "about",
                    title: "Về ứng dụng",
                    description: "Thông tin về ứng dụng",
                    type: "link",
                    icon: "info",
                    onPress: () => router.push("/child/about"),
                },
            ],
        },
    ];

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Cài đặt" />
            
            <ScrollView>
                {SETTINGS_SECTIONS.map((section) => (
                    <View key={section.title} className="mb-6">
                        <Text className="px-4 py-2 text-sm font-medium text-gray-500">
                            {section.title}
                        </Text>
                        <View className="bg-white">
                            {section.items.map((item, index) => (
                                <View 
                                    key={item.id}
                                    className={`px-4 py-3 flex-row items-center justify-between ${
                                        index !== section.items.length - 1 ? "border-b border-gray-100" : ""
                                    }`}
                                >
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            {item.type === "link" && (
                                                <MaterialIcons 
                                                    name={item.icon as any} 
                                                    size={24} 
                                                    color="#7C3AED" 
                                                    className="mr-3"
                                                />
                                            )}
                                            <Text className="font-medium">{item.title}</Text>
                                        </View>
                                        <Text className="text-gray-600 text-sm mt-1">
                                            {item.description}
                                        </Text>
                                    </View>
                                    {item.type === "switch" ? (
                                        <Switch
                                            value={item.value}
                                            onValueChange={item.onValueChange}
                                            trackColor={{ false: "#E5E7EB", true: "#DDD6FE" }}
                                            thumbColor={item.value ? "#7C3AED" : "#9CA3AF"}
                                        />
                                    ) : (
                                        <MaterialIcons 
                                            name="chevron-right" 
                                            size={24} 
                                            color="#9CA3AF" 
                                        />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <View className="p-4">
                    <Pressable 
                        className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl"
                        onPress={() => router.push("/login")}
                    >
                        <MaterialIcons name="logout" size={24} color="#EF4444" />
                        <Text className="ml-2 text-red-500 font-medium">
                            Đăng xuất
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
} 