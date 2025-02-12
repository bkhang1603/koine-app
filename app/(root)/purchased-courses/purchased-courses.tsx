import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import {
    MOCK_USER,
    MOCK_COURSES,
    MOCK_PURCHASED_COURSES,
} from "@/constants/mock-data";

export default function PurchasedCoursesScreen() {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [showActivateModal, setShowActivateModal] = useState(false);

    // Lấy thông tin đầy đủ của khóa học từ MOCK_COURSES
    const purchasedCoursesWithDetails = MOCK_PURCHASED_COURSES.map(
        (purchased) => {
            const courseDetails = MOCK_COURSES.find(
                (c) => c.id === purchased.courseId
            );
            return {
                ...purchased,
                ...courseDetails,
                remainingActivations: purchased.quantity - purchased.activated,
            };
        }
    );

    // Lọc ra các khóa học còn slot để kích hoạt
    const availableForActivation = purchasedCoursesWithDetails.filter(
        (course) => course.remainingActivations > 0
    );

    const handleActivate = (courseId: string) => {
        setSelectedCourse(courseId);
        setShowActivateModal(true);
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Khóa học chờ kích hoạt" />

            <ScrollView>
                {/* Stats */}
                <View className="flex-row p-4">
                    <View className="flex-1 bg-blue-50 rounded-xl p-4 mr-2">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
                            <MaterialIcons
                                name="shopping-bag"
                                size={24}
                                color="#3B82F6"
                            />
                        </View>
                        <Text className="text-2xl font-bold">
                            {MOCK_PURCHASED_COURSES.length}
                        </Text>
                        <Text className="text-gray-600">Đã mua</Text>
                    </View>
                    <View className="flex-1 bg-green-50 rounded-xl p-4 ml-2">
                        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
                            <MaterialIcons
                                name="person-add"
                                size={24}
                                color="#059669"
                            />
                        </View>
                        <Text className="text-2xl font-bold">
                            {availableForActivation.reduce(
                                (sum, course) =>
                                    sum + course.remainingActivations,
                                0
                            )}
                        </Text>
                        <Text className="text-gray-600">Chờ kích hoạt</Text>
                    </View>
                </View>

                {/* Course List */}
                <View className="p-4">
                    {purchasedCoursesWithDetails.map((course) => (
                        <View
                            key={course.courseId}
                            className="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Image
                                source={{ uri: course.thumbnail }}
                                className="w-full h-48 rounded-t-xl"
                            />
                            <View className="p-4">
                                <Text className="font-bold text-lg mb-2">
                                    {course.title}
                                </Text>

                                {/* Purchase Info */}
                                <View className="flex-row items-center mb-3">
                                    <MaterialIcons
                                        name="event"
                                        size={16}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-600 ml-1">
                                        Mua ngày {course.purchaseDate}
                                    </Text>
                                    <Text className="text-gray-400 mx-2">
                                        •
                                    </Text>
                                    <MaterialIcons
                                        name="receipt"
                                        size={16}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-600 ml-1">
                                        {course.orderId}
                                    </Text>
                                </View>

                                {/* Course Info */}
                                <View className="flex-row items-center mb-3">
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

                                {/* Activation Status */}
                                <View className="bg-gray-50 p-3 rounded-lg mb-4">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-gray-600">
                                            Số lượng mua
                                        </Text>
                                        <Text className="font-medium">
                                            {course.quantity}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-gray-600">
                                            Đã kích hoạt
                                        </Text>
                                        <Text className="font-medium">
                                            {course.activated}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">
                                            Còn lại
                                        </Text>
                                        <Text className="font-medium text-blue-500">
                                            {course.remainingActivations}
                                        </Text>
                                    </View>
                                </View>

                                {/* Activated For */}
                                {course.activatedFor.length > 0 && (
                                    <View className="mb-4">
                                        <Text className="font-medium mb-2">
                                            Đã kích hoạt cho:
                                        </Text>
                                        <View className="flex-row flex-wrap">
                                            {course.activatedFor.map(
                                                (accountId) => {
                                                    const account =
                                                        accountId === "main"
                                                            ? {
                                                                  name: MOCK_USER.name,
                                                                  avatar: MOCK_USER.avatar,
                                                              }
                                                            : MOCK_USER.subAccounts.find(
                                                                  (acc) =>
                                                                      acc.id ===
                                                                      accountId
                                                              );
                                                    return (
                                                        account && (
                                                            <View
                                                                key={accountId}
                                                                className="flex-row items-center mr-4 mb-2"
                                                            >
                                                                <Image
                                                                    source={{
                                                                        uri: account.avatar,
                                                                    }}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                                <Text className="ml-2 text-gray-600">
                                                                    {
                                                                        account.name
                                                                    }
                                                                </Text>
                                                            </View>
                                                        )
                                                    );
                                                }
                                            )}
                                        </View>
                                    </View>
                                )}

                                {course.remainingActivations > 0 && (
                                    <Pressable
                                        className="bg-blue-500 p-4 rounded-xl flex-row items-center justify-center"
                                        onPress={() =>
                                            handleActivate(course.courseId)
                                        }
                                    >
                                        <MaterialIcons
                                            name="person-add"
                                            size={20}
                                            color="#fff"
                                        />
                                        <Text className="text-white font-bold ml-2">
                                            Kích hoạt khóa học
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    ))}

                    {/* Empty State */}
                    {purchasedCoursesWithDetails.length === 0 && (
                        <View className="items-center justify-center py-8">
                            <MaterialIcons
                                name="school"
                                size={48}
                                color="#9CA3AF"
                            />
                            <Text className="text-gray-500 mt-2 text-center">
                                Bạn chưa mua khóa học nào
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Activation Modal */}
            <Modal
                visible={showActivateModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowActivateModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-center">
                    <View className="bg-white mx-4 rounded-2xl">
                        <View className="p-4 border-b border-gray-100">
                            <Text className="text-lg font-bold">
                                Chọn người học
                            </Text>
                        </View>

                        <ScrollView className="max-h-[70vh]">
                            {/* Main Account */}
                            <Pressable
                                className="flex-row items-center p-4 border-b border-gray-100"
                                onPress={() => {
                                    // TODO: Activate for main account
                                    setShowActivateModal(false);
                                    router.push("/my-courses" as any);
                                }}
                            >
                                <Image
                                    source={{ uri: MOCK_USER.avatar }}
                                    className="w-12 h-12 rounded-full"
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="font-bold">
                                        {MOCK_USER.name}
                                    </Text>
                                    <Text className="text-gray-600">
                                        Tài khoản chính
                                    </Text>
                                </View>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={24}
                                    color="#9CA3AF"
                                />
                            </Pressable>

                            {/* Sub Accounts */}
                            {MOCK_USER.subAccounts.map((account) => (
                                <Pressable
                                    key={account.id}
                                    className="flex-row items-center p-4 border-b border-gray-100"
                                    onPress={() => {
                                        // TODO: Activate for sub account
                                        setShowActivateModal(false);
                                        router.push({
                                            pathname: "/sub-accounts/[id]",
                                            params: { id: account.id },
                                        });
                                    }}
                                >
                                    <Image
                                        source={{ uri: account.avatar }}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <View className="ml-3 flex-1">
                                        <Text className="font-bold">
                                            {account.name}
                                        </Text>
                                        <Text className="text-gray-600">
                                            {2024 - account.birthYear} tuổi
                                        </Text>
                                    </View>
                                    <MaterialIcons
                                        name="chevron-right"
                                        size={24}
                                        color="#9CA3AF"
                                    />
                                </Pressable>
                            ))}
                        </ScrollView>

                        <View className="p-4 border-t border-gray-100">
                            <Pressable
                                className="p-4 bg-gray-100 rounded-xl items-center"
                                onPress={() => setShowActivateModal(false)}
                            >
                                <Text className="font-medium text-gray-700">
                                    Đóng
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
