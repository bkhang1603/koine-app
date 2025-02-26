import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import {
    MOCK_USER,
    MOCK_COURSES,
    MOCK_PURCHASED_COURSES,
} from "@/constants/mock-data";

const STATS = [
    {
        id: "total",
        label: "Tổng tài khoản",
        value: MOCK_USER.subAccounts.length,
        icon: "people",
        color: "blue",
    },
    {
        id: "active",
        label: "Đang học",
        value: MOCK_USER.subAccounts.filter(
            (acc) => acc.activeCourses.length > 0
        ).length,
        icon: "school",
        color: "green",
    },
    {
        id: "available",
        label: "Khóa học chờ kích hoạt",
        value: MOCK_PURCHASED_COURSES.reduce(
            (sum, course) => sum + (course.quantity - course.activated),
            0
        ),
        icon: "pending-actions",
        color: "yellow",
    },
];

const QUICK_ACTIONS = [
    {
        id: "add",
        title: "Thêm tài khoản",
        description: "Tạo tài khoản mới",
        icon: "person-add",
        color: "blue",
        route: "/sub-accounts/create",
    },
    {
        id: "activate",
        title: "Kích hoạt khóa học",
        description: "Phân bổ khóa học",
        icon: "school",
        color: "green",
        route: "/purchased-courses/purchased-courses",
    },
    {
        id: "manage",
        title: "Quản lý học tập",
        description: "Theo dõi tiến độ",
        icon: "insights",
        color: "purple",
        route: "/learning-management/learning-management",
    },
];

export default function SubAccountsScreen() {
    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Quản lý tài khoản con" returnTab={"/(tabs)/profile/profile"}/>
            <ScrollView>
                {/* Stats */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="p-4"
                >
                    {STATS.map((stat) => (
                        <View
                            key={stat.id}
                            className={`bg-${stat.color}-50 rounded-xl p-4 mr-3`}
                            style={{ minWidth: 150 }}
                        >
                            <View
                                className={`w-10 h-10 bg-${stat.color}-100 rounded-full items-center justify-center mb-2`}
                            >
                                <MaterialIcons
                                    name={stat.icon as any}
                                    size={24}
                                    color={`#${
                                        stat.color === "blue"
                                            ? "3B82F6"
                                            : stat.color === "green"
                                            ? "059669"
                                            : "EAB308"
                                    }`}
                                />
                            </View>
                            <Text className="text-2xl font-bold">
                                {stat.value}
                            </Text>
                            <Text className="text-gray-600">{stat.label}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Quick Actions */}
                <View className="p-4 border-t border-gray-100">
                    <Text className="text-lg font-bold mb-3">
                        Thao tác nhanh
                    </Text>
                    <View className="flex-row flex-wrap">
                        {QUICK_ACTIONS.map((action) => (
                            <Pressable
                                key={action.id}
                                className="w-1/3 p-2"
                                onPress={() => router.push(action.route as any)}
                            >
                                <View
                                    className={`bg-${action.color}-50 p-4 rounded-xl items-center`}
                                >
                                    <MaterialIcons
                                        name={action.icon as any}
                                        size={24}
                                        color={`#${
                                            action.color === "blue"
                                                ? "3B82F6"
                                                : action.color === "green"
                                                ? "059669"
                                                : "9333EA"
                                        }`}
                                    />
                                    <Text className="font-medium mt-2 text-center">
                                        {action.title}
                                    </Text>
                                    <Text className="text-gray-600 text-xs mt-1 text-center">
                                        {action.description}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Sub Accounts List */}
                <View className="p-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold">
                            Danh sách tài khoản ({MOCK_USER.subAccounts.length})
                        </Text>
                        <Pressable
                            className="flex-row items-center"
                            onPress={() =>
                                router.push("/sub-accounts/create" as any)
                            }
                        >
                            <MaterialIcons
                                name="add"
                                size={24}
                                color="#3B82F6"
                            />
                            <Text className="text-blue-500 font-medium ml-1">
                                Thêm mới
                            </Text>
                        </Pressable>
                    </View>

                    {MOCK_USER.subAccounts.map((account) => {
                        const activeCourses = MOCK_COURSES.filter((course) =>
                            account.activeCourses.includes(course.id)
                        );
                        return (
                            <Pressable
                                key={account.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 mb-4"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                                onPress={() =>
                                    router.push({
                                        pathname: "/sub-accounts/[id]",
                                        params: { id: account.id },
                                    })
                                }
                            >
                                <View className="flex-row items-start">
                                    <Image
                                        source={{ uri: account.avatar }}
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <View className="ml-4 flex-1">
                                        <View className="flex-row items-center justify-between">
                                            <Text className="font-bold text-lg">
                                                {account.name}
                                            </Text>
                                            <View
                                                className={`px-3 py-1 rounded-full ${
                                                    activeCourses.length > 0
                                                        ? "bg-green-100"
                                                        : "bg-gray-100"
                                                }`}
                                            >
                                                <Text
                                                    className={
                                                        activeCourses.length > 0
                                                            ? "text-green-700"
                                                            : "text-gray-600"
                                                    }
                                                >
                                                    {activeCourses.length > 0
                                                        ? "Đang học"
                                                        : "Chưa học"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-gray-600">
                                                {2024 - account.birthYear} tuổi
                                            </Text>
                                            <Text className="text-gray-400 mx-2">
                                                •
                                            </Text>
                                            <Text
                                                className={`${
                                                    account.gender === "male"
                                                        ? "text-blue-600"
                                                        : "text-pink-600"
                                                }`}
                                            >
                                                {account.gender === "male"
                                                    ? "Nam"
                                                    : "Nữ"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Learning Stats */}
                                <View className="flex-row mt-4 pt-4 border-t border-gray-100">
                                    <View className="flex-1 border-r border-gray-100">
                                        <Text className="text-center text-gray-600">
                                            Khóa học
                                        </Text>
                                        <Text className="text-center font-bold text-lg mt-1">
                                            {activeCourses.length}
                                        </Text>
                                    </View>
                                    <View className="flex-1 border-r border-gray-100">
                                        <Text className="text-center text-gray-600">
                                            Thời gian
                                        </Text>
                                        <Text className="text-center font-bold text-lg mt-1">
                                            {activeCourses.reduce(
                                                (sum, course) =>
                                                    sum +
                                                    parseInt(course.duration),
                                                0
                                            )}{" "}
                                            giờ
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-center text-gray-600">
                                            Tiến độ
                                        </Text>
                                        <Text className="text-center font-bold text-lg mt-1">
                                            {Math.round(
                                                activeCourses.reduce(
                                                    (sum, course) =>
                                                        sum +
                                                        (course.progress || 0),
                                                    0
                                                ) / (activeCourses.length || 1)
                                            )}
                                            %
                                        </Text>
                                    </View>
                                </View>

                                {/* Quick Actions */}
                                {/* <View className="flex-row mt-4 pt-4 border-t border-gray-100">
                                    <Pressable
                                        className="flex-1 flex-row items-center justify-center"
                                        onPress={() => {}}
                                    >
                                        <MaterialIcons
                                            name="edit"
                                            size={20}
                                            color="#374151"
                                        />
                                    </Pressable>
                                    <View className="w-px h-6 bg-gray-200 self-center" />
                                    <Pressable
                                        className="flex-1 flex-row items-center justify-center"
                                        onPress={() =>
                                            router.push(
                                                "/purchased-courses/purchased-courses" as any
                                            )
                                        }
                                    >
                                        <MaterialIcons
                                            name="school"
                                            size={20}
                                            color="#374151"
                                        />
                                    </Pressable>
                                    <View className="w-px h-6 bg-gray-200 self-center" />
                                    <Pressable
                                        className="flex-1 flex-row items-center justify-center"
                                        onPress={() =>
                                            router.push({
                                                pathname:
                                                    "/learning-management/learning-management",
                                                params: {
                                                    selectedAccount: account.id,
                                                },
                                            } as any)
                                        }
                                    >
                                        <MaterialIcons
                                            name="insights"
                                            size={20}
                                            color="#374151"
                                        />
                                    </Pressable>
                                </View> */}
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
