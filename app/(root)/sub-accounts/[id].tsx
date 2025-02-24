import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_USER, MOCK_COURSES } from "@/constants/mock-data";

export default function SubAccountDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const account = MOCK_USER.subAccounts.find((acc) => acc.id === id);
    const activeCourses = MOCK_COURSES.filter((course) =>
        account?.activeCourses.includes(course.id)
    );

    if (!account) return null;

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Chi tiết tài khoản" isNotBackable={true}/>
            <ScrollView>
                {/* Profile Header */}
                <View className="p-4 items-center border-b border-gray-100">
                    <Image
                        source={{ uri: account.avatar }}
                        className="w-24 h-24 rounded-full"
                    />
                    <Text className="text-xl font-bold mt-3">
                        {account.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <Text className="text-gray-600">
                            {2024 - account.birthYear} tuổi
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text
                            className={`${
                                account.gender === "male"
                                    ? "text-blue-600"
                                    : "text-pink-600"
                            }`}
                        >
                            {account.gender === "male" ? "Nam" : "Nữ"}
                        </Text>
                    </View>
                </View>

                {/* Learning Stats */}
                <View className="p-4 bg-blue-50">
                    <Text className="text-lg font-bold mb-4">
                        Thống kê học tập
                    </Text>
                    <View className="flex-row -mx-2">
                        <View className="flex-1 px-2">
                            <View className="bg-white p-4 rounded-xl">
                                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
                                    <MaterialIcons
                                        name="school"
                                        size={24}
                                        color="#3B82F6"
                                    />
                                </View>
                                <Text className="text-2xl font-bold">
                                    {activeCourses.length}
                                </Text>
                                <Text className="text-gray-600">
                                    Khóa học đang học
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 px-2">
                            <View className="bg-white p-4 rounded-xl">
                                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
                                    <MaterialIcons
                                        name="schedule"
                                        size={24}
                                        color="#059669"
                                    />
                                </View>
                                <Text className="text-2xl font-bold">
                                    {activeCourses.reduce(
                                        (sum, course) =>
                                            sum + parseInt(course.duration),
                                        0
                                    )}
                                </Text>
                                <Text className="text-gray-600">
                                    Tổng giờ học
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 px-2">
                            <View className="bg-white p-4 rounded-xl">
                                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mb-2">
                                    <MaterialIcons
                                        name="trending-up"
                                        size={24}
                                        color="#9333EA"
                                    />
                                </View>
                                <Text className="text-2xl font-bold">
                                    {Math.round(
                                        activeCourses.reduce(
                                            (sum, course) =>
                                                sum + (course.progress || 0),
                                            0
                                        ) / (activeCourses.length || 1)
                                    )}
                                    %
                                </Text>
                                <Text className="text-gray-600">
                                    Tiến độ trung bình
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Active Courses */}
                <View className="p-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold">
                            Khóa học đang học
                        </Text>
                        <Pressable
                            className="flex-row items-center"
                            onPress={() =>
                                router.push(
                                    "/purchased-courses/purchased-courses" as any
                                )
                            }
                        >
                            <MaterialIcons
                                name="add"
                                size={24}
                                color="#3B82F6"
                            />
                            <Text className="text-blue-500 font-medium ml-1">
                                Kích hoạt thêm
                            </Text>
                        </Pressable>
                    </View>

                    {activeCourses.map((course) => (
                        <Pressable
                            key={course.id}
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
                                    pathname:
                                        "/learning-management/course-progress/[id]",
                                    params: {
                                        id: course.id,
                                        accountId: account.id,
                                    },
                                })
                            }
                        >
                            <View className="flex-row">
                                <Image
                                    source={{ uri: course.thumbnail }}
                                    className="w-20 h-20 rounded-lg"
                                />
                                <View className="ml-3 flex-1">
                                    <Text
                                        className="font-bold"
                                        numberOfLines={2}
                                    >
                                        {course.title}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <MaterialIcons
                                            name="schedule"
                                            size={16}
                                            color="#6B7280"
                                        />
                                        <Text className="text-gray-600 ml-1">
                                            {course.duration}
                                        </Text>
                                        <Text className="text-gray-400 mx-2">
                                            •
                                        </Text>
                                        <MaterialIcons
                                            name="bar-chart"
                                            size={16}
                                            color="#6B7280"
                                        />
                                        <Text className="text-gray-600 ml-1">
                                            {course.level}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Progress */}
                            <View className="mt-3">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-gray-600">
                                        Tiến độ học tập
                                    </Text>
                                    <Text className="font-medium">
                                        {course.progress || 0}%
                                    </Text>
                                </View>
                                <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <View
                                        className="bg-blue-500 h-full rounded-full"
                                        style={{
                                            width: `${course.progress || 0}%`,
                                        }}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    ))}

                    {activeCourses.length === 0 && (
                        <View className="items-center py-8">
                            <MaterialIcons
                                name="school"
                                size={48}
                                color="#9CA3AF"
                            />
                            <Text className="text-gray-500 mt-2 text-center">
                                Chưa có khóa học nào được kích hoạt
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View className="p-4 border-t border-gray-100">
                    <Pressable
                        className="bg-blue-500 p-4 rounded-xl flex-row items-center justify-center mb-3"
                        onPress={() =>
                            router.push(
                                "/purchased-courses/purchased-courses" as any
                            )
                        }
                    >
                        <MaterialIcons name="school" size={24} color="#fff" />
                        <Text className="text-white font-bold ml-2">
                            Kích hoạt khóa học mới
                        </Text>
                    </Pressable>
                    <Pressable
                        className="bg-gray-100 p-4 rounded-xl flex-row items-center justify-center"
                        onPress={() =>
                            router.push({
                                pathname: "/sub-accounts/edit/[id]",
                                params: { id: account.id },
                            })
                        }
                    >
                        <MaterialIcons name="edit" size={24} color="#374151" />
                        <Text className="text-gray-700 font-bold ml-2">
                            Chỉnh sửa thông tin
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
