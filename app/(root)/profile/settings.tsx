import React from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";

type BaseSettingItem = {
    id: string;
    title: string;
    icon: string;
};

type LinkItem = BaseSettingItem & {
    type: "link";
    route: string;
};

type ToggleItem = BaseSettingItem & {
    type: "toggle";
    value: boolean;
    onValueChange: (value: boolean) => void;
};

type ButtonItem = BaseSettingItem & {
    type: "button";
    color?: string;
    onPress: () => void;
};

type SettingItem = LinkItem | ToggleItem | ButtonItem;

type SettingSection = {
    title: string;
    items: SettingItem[];
};

export default function SettingsScreen() {
    const [notifications, setNotifications] = React.useState(true);
    const [emailUpdates, setEmailUpdates] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const settingSections: SettingSection[] = [
        {
            title: "Tài khoản",
            items: [
                {
                    id: "profile",
                    title: "Chỉnh sửa hồ sơ",
                    icon: "person",
                    type: "link",
                    route: "/profile/edit-profile",
                },
                {
                    id: "password",
                    title: "Đổi mật khẩu",
                    icon: "lock",
                    type: "link",
                    route: "/change-password",
                },
                {
                    id: "payment",
                    title: "Phương thức thanh toán",
                    icon: "credit-card",
                    type: "link",
                    route: "/payment-methods",
                },
            ],
        },
        {
            title: "Thông báo",
            items: [
                {
                    id: "push",
                    title: "Thông báo đẩy",
                    icon: "notifications",
                    type: "toggle",
                    value: notifications,
                    onValueChange: setNotifications,
                },
                {
                    id: "email",
                    title: "Cập nhật qua email",
                    icon: "mail",
                    type: "toggle",
                    value: emailUpdates,
                    onValueChange: setEmailUpdates,
                },
            ],
        },
        {
            title: "Giao diện",
            items: [
                {
                    id: "dark",
                    title: "Chế độ tối",
                    icon: "dark-mode",
                    type: "toggle",
                    value: darkMode,
                    onValueChange: setDarkMode,
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
                    type: "link",
                    route: "/about",
                },
                {
                    id: "privacy",
                    title: "Chính sách bảo mật",
                    icon: "privacy-tip",
                    type: "link",
                    route: "/privacy",
                },
                {
                    id: "terms",
                    title: "Điều khoản sử dụng",
                    icon: "description",
                    type: "link",
                    route: "/terms",
                }
            ],
        },
    ];

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Cài đặt" returnTab={"/(tabs)/profile/profile"}/>

            <ScrollView className="flex-1">
                {settingSections.map((section) => (
                    <View key={section.title} className="mb-6">
                        <Text className="px-4 py-2 text-sm font-medium text-gray-500">
                            {section.title}
                        </Text>
                        <View className="bg-white">
                            {section.items.map((item, index) => (
                                <Pressable
                                    key={item.id}
                                    className={`flex-row items-center px-4 py-3 ${
                                        index !== section.items.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                    }`}
                                    // onPress={() => {
                                    //     if (item.type === "link") {
                                    //         router.push(item.route as any);
                                    //     } else if (item.type === "button") {
                                    //         item.onPress();
                                    //     }
                                    // }}
                                >
                                    <MaterialIcons
                                        name={item.icon as any}
                                        size={24}
                                        color={
                                            item.id === "logout"
                                                ? "#EF4444"
                                                : "#374151"
                                        }
                                    />
                                    <Text
                                        className={`flex-1 ml-3 ${
                                            item.type === "button" && item.color
                                                ? item.color
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {item.title}
                                    </Text>
                                    {item.type === "toggle" ? (
                                        <Switch
                                            value={item.value}
                                            onValueChange={item.onValueChange}
                                            trackColor={{
                                                false: "#D1D5DB",
                                                true: "#2563EB",
                                            }}
                                        />
                                    ) : item.type === "link" ? (
                                        <MaterialIcons
                                            name="chevron-right"
                                            size={24}
                                            color="#9CA3AF"
                                        />
                                    ) : null}
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
