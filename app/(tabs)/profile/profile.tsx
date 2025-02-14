import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/components/auth";
import { MOCK_USER } from "@/constants/mock-data";

const MENU_ITEMS = [
    {
        id: "sub-accounts",
        title: "Quản lý tài khoản con",
        icon: "people",
        route: "/sub-accounts/sub-accounts",
        badge: MOCK_USER.subAccounts.length.toString(),
    },
    {
        id: "my-courses",
        title: "Khóa học đã mua",
        icon: "school",
        route: "/purchased-courses/purchased-courses",
    },
    {
        id: "orders",
        title: "Đơn hàng",
        icon: "receipt-long",
        route: "/orders/orders",
    },
    {
        id: "certificates",
        title: "Chứng chỉ",
        icon: "card-membership",
        route: "/certificates/certificates",
    },
    {
        id: "notifications",
        title: "Thông báo",
        icon: "notifications",
        route: "/notifications/notifications",
    },
    {
        id: "settings",
        title: "Cài đặt",
        icon: "settings",
        route: "/profile/settings",
    },
];

export default function ProfileScreen() {
    const { signOut } = useAuth();

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <SafeAreaView>
                {/* Profile Header */}
                <View className="px-4">
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: MOCK_USER.avatar }}
                            className="w-20 h-20 rounded-full"
                        />
                        <View className="ml-4 flex-1">
                            <Text className="text-xl font-bold">
                                {MOCK_USER.name}
                            </Text>
                            <Text className="text-gray-600">
                                {MOCK_USER.email}
                            </Text>
                        </View>
                        <Pressable
                            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                            onPress={() =>
                                router.push("/profile/edit-profile" as any)
                            }
                        >
                            <MaterialIcons
                                name="edit"
                                size={20}
                                color="#374151"
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Quick Stats */}
                <View className="flex-row px-4 mt-6">
                    <View className="flex-1 bg-blue-50 rounded-xl p-4 mr-2">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <MaterialIcons
                                name="people"
                                size={24}
                                color="#3B82F6"
                            />
                        </View>
                        <Text className="text-2xl font-bold">
                            {MOCK_USER.subAccounts.length}
                        </Text>
                        <Text className="text-gray-600">Tài khoản con</Text>
                    </View>
                    <View className="flex-1 bg-green-50 rounded-xl p-4 ml-2">
                        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
                            <MaterialIcons
                                name="school"
                                size={24}
                                color="#059669"
                            />
                        </View>
                        <Text className="text-2xl font-bold">
                            {MOCK_USER.purchasedCourses.length}
                        </Text>
                        <Text className="text-gray-600">Khóa học đã mua</Text>
                    </View>
                </View>

                {/* Sub Accounts Preview */}
                <View className="mt-6 px-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold">Tài khoản con</Text>
                        <Pressable
                            className="flex-row items-center"
                            onPress={() =>
                                router.push("/sub-accounts/sub-accounts")
                            }
                        >
                            <Text className="text-blue-500 mr-1">
                                Xem tất cả
                            </Text>
                            <MaterialIcons
                                name="chevron-right"
                                size={20}
                                color="#3B82F6"
                            />
                        </Pressable>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6"
                    >
                        {/* Add Account Button */}
                        <Pressable
                            className="w-24 h-32 bg-gray-50 rounded-xl items-center justify-center mr-3 border-2 border-dashed border-gray-200"
                            onPress={() =>
                                router.push("/sub-accounts/create" as any)
                            }
                        >
                            <MaterialIcons
                                name="person-add"
                                size={24}
                                color="#3B82F6"
                            />
                            <Text className="text-blue-500 text-center mt-2 text-sm">
                                Thêm tài khoản
                            </Text>
                        </Pressable>

                        {/* Sub Accounts */}
                        {MOCK_USER.subAccounts.map((account) => (
                            <Pressable
                                key={account.id}
                                className="w-24 items-center mr-3"
                                onPress={() =>
                                    router.push({
                                        pathname: "/sub-accounts/[id]",
                                        params: { id: account.id },
                                    })
                                }
                            >
                                <Image
                                    source={{ uri: account.avatar }}
                                    className="w-24 h-24 rounded-xl"
                                />
                                <Text className="font-medium mt-2 text-center">
                                    {account.name}
                                </Text>
                                <Text className="text-gray-500 text-sm">
                                    {2024 - account.birthYear} tuổi
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Menu Items */}
                <View className="px-4">
                    {MENU_ITEMS.map((item) => (
                        <Pressable
                            key={item.id}
                            className="flex-row items-center py-4 border-t border-gray-100"
                            onPress={() => router.push(item.route as any)}
                        >
                            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                                <MaterialIcons
                                    name={item.icon as any}
                                    size={24}
                                    color="#374151"
                                />
                            </View>
                            <Text className="flex-1 font-medium ml-3">
                                {item.title}
                            </Text>
                            {item.badge && (
                                <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                                    <Text className="text-blue-600 text-sm">
                                        {item.badge}
                                    </Text>
                                </View>
                            )}
                            <MaterialIcons
                                name="chevron-right"
                                size={24}
                                color="#9CA3AF"
                            />
                        </Pressable>
                    ))}
                </View>

                {/* Logout Button */}
                <View className="p-4">
                    <Pressable
                        className="flex-row items-center justify-center py-4"
                        onPress={signOut}
                    >
                        <MaterialIcons
                            name="logout"
                            size={24}
                            color="#EF4444"
                        />
                        <Text className="ml-2 text-red-500 font-medium">
                            Đăng xuất
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}
