import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, Modal } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useAppStore } from "@/components/app-provider";
import { useMyChildCourses } from "@/queries/useUser";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import formatDuration from "@/util/formatDuration";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Menu options giống như trong HeaderWithBack
const MENU_OPTIONS = [
    {
        id: "home",
        title: "Trang chủ",
        icon: "home",
        route: "/(tabs)/home",
    },
    {
        id: "courses",
        title: "Khóa học",
        icon: "menu-book",
        route: "/(tabs)/course/course",
    },
    {
        id: "my-courses",
        title: "Khóa học của tôi",
        icon: "school",
        route: "/(tabs)/my-courses/my-courses",
    },
    {
        id: "profile",
        title: "Tài khoản",
        icon: "person",
        route: "/(tabs)/profile/profile",
    },
    {
        id: "blog",
        title: "Blog",
        icon: "article",
        route: "/(tabs)/blog/blog",
    },
];

export default function SubAccountDetailScreen() {
    const { id } = useLocalSearchParams();
    const childs = useAppStore((state) => state.childs);
    const account = childs?.find((child) => child.id == id);
    const accessToken = useAppStore((state) => state.accessToken);
    const token = accessToken == undefined ? "" : accessToken.accessToken;
    const [showMenu, setShowMenu] = useState(false);
    const insets = useSafeAreaInsets();

    if (!account) return null;
    const {
        data: childCourse,
        isError,
        isLoading,
        refetch,
    } = useMyChildCourses({ childId: account.id, token: token });

    useFocusEffect(() => {
        refetch();
    });
    if (isLoading) return <ActivityIndicatorScreen />;

    if (isError || !childCourse?.data) {
        return (
            <View className="flex-1 bg-[#f5f7f9]">
                <StatusBar style="dark" />

                {/* Header with Gradient Background */}
                <LinearGradient
                    colors={["#3b82f6", "#1d4ed8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="pt-14 pb-6 px-5"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() =>
                                    router.push(
                                        "/(root)/sub-accounts/sub-accounts"
                                    )
                                }
                                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                            >
                                <MaterialIcons
                                    name="arrow-back"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>
                            <Text className="text-white text-lg font-bold ml-4">
                                Chi tiết tài khoản
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Pressable
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
                                onPress={() =>
                                    router.push(
                                        "/(root)/notifications/notifications"
                                    )
                                }
                            >
                                <MaterialIcons
                                    name="notifications-none"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>

                            <Pressable
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                                onPress={() => setShowMenu(true)}
                            >
                                <MaterialIcons
                                    name="more-vert"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>

                <View className="flex-1 items-center justify-center">
                    <Text className="text-red-500">
                        Có lỗi xảy ra khi tải dữ liệu
                    </Text>
                </View>

                {/* Menu Dropdown */}
                <Modal
                    visible={showMenu}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowMenu(false)}
                >
                    <Pressable
                        className="flex-1 bg-black/50"
                        onPress={() => setShowMenu(false)}
                    >
                        <View
                            className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl w-64"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            {MENU_OPTIONS.map((option, index) => (
                                <Pressable
                                    key={option.id}
                                    onPress={() => {
                                        setShowMenu(false);
                                        router.replace(option.route as any);
                                    }}
                                    className={`flex-row items-center p-4 ${
                                        index !== MENU_OPTIONS.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                    }`}
                                >
                                    <MaterialIcons
                                        name={option.icon as any}
                                        size={24}
                                        color="#374151"
                                    />
                                    <Text className="ml-3 text-gray-700">
                                        {option.title}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
            </View>
        );
    }

    if (!childCourse.data.courses || childCourse.data.courses.length === 0) {
        return (
            <View className="flex-1 bg-[#f5f7f9]">
                <StatusBar style="dark" />

                {/* Header with Gradient Background */}
                <LinearGradient
                    colors={["#3b82f6", "#1d4ed8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="pt-14 pb-6 px-5"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() =>
                                    router.push(
                                        "/(root)/sub-accounts/sub-accounts"
                                    )
                                }
                                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                            >
                                <MaterialIcons
                                    name="arrow-back"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>
                            <Text className="text-white text-lg font-bold ml-4">
                                Chi tiết tài khoản
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Pressable
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
                                onPress={() =>
                                    router.push(
                                        "/(root)/notifications/notifications"
                                    )
                                }
                            >
                                <MaterialIcons
                                    name="notifications-none"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>

                            <Pressable
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                                onPress={() => setShowMenu(true)}
                            >
                                <MaterialIcons
                                    name="more-vert"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="p-4 mt-4 mx-4 items-center border-b border-gray-100 bg-white rounded-xl shadow-sm">
                        <Image
                            source={{ uri: account?.userDetail.avatarUrl }}
                            className="w-24 h-24 rounded-full mt-2"
                        />
                        <Text className="text-xl font-bold mt-3">
                            {account?.userDetail.lastName +
                                " " +
                                account?.userDetail.firstName}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-gray-600">
                                {new Date().getFullYear() -
                                    new Date(
                                        account?.userDetail.dob
                                    ).getFullYear()}{" "}
                                tuổi
                            </Text>
                            <Text className="text-gray-400 mx-2">•</Text>
                            <Text
                                className={`${
                                    account?.userDetail.gender == "MALE"
                                        ? "text-blue-600"
                                        : "text-pink-600"
                                }`}
                            >
                                {account?.userDetail.gender == "MALE"
                                    ? "Nam"
                                    : "Nữ"}
                            </Text>
                        </View>
                        <View className="flex-row px-2 my-4">
                            <Pressable
                                className="bg-blue-500 p-2 mx-2 rounded-xl flex-row items-center justify-center px-4"
                                onPress={() =>
                                    router.push(
                                        "/purchased-courses/purchased-courses" as any
                                    )
                                }
                            >
                                <MaterialIcons
                                    name="school"
                                    size={20}
                                    color="#fff"
                                />
                                <Text className="text-white font-medium ml-2">
                                    Gán khóa học
                                </Text>
                            </Pressable>
                            <Pressable
                                className="bg-gray-100 p-2 mx-2 rounded-xl flex-row items-center justify-center px-4"
                                onPress={() =>
                                    router.push({
                                        pathname: "/sub-accounts/edit/[id]",
                                        params: { id: account.id },
                                    })
                                }
                            >
                                <MaterialIcons
                                    name="edit"
                                    size={20}
                                    color="#374151"
                                />
                                <Text className="text-gray-700 font-medium ml-2">
                                    Chỉnh sửa
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <View className="flex-1 items-center justify-center p-4 mt-2">
                        <MaterialIcons
                            name="school"
                            size={64}
                            color="#9CA3AF"
                        />
                        <Text className="text-gray-500 text-lg mt-4 text-center">
                            Chưa gán cho {account.userDetail.firstName} khóa học
                            nào
                        </Text>
                        <Pressable
                            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                            onPress={() =>
                                router.push(
                                    "/(root)/purchased-courses/purchased-courses"
                                )
                            }
                        >
                            <Text className="text-white font-bold">
                                Gán ngay?
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>

                {/* Menu Dropdown */}
                <Modal
                    visible={showMenu}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowMenu(false)}
                >
                    <Pressable
                        className="flex-1 bg-black/50"
                        onPress={() => setShowMenu(false)}
                    >
                        <View
                            className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl w-64"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            {MENU_OPTIONS.map((option, index) => (
                                <Pressable
                                    key={option.id}
                                    onPress={() => {
                                        setShowMenu(false);
                                        router.replace(option.route as any);
                                    }}
                                    className={`flex-row items-center p-4 ${
                                        index !== MENU_OPTIONS.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                    }`}
                                >
                                    <MaterialIcons
                                        name={option.icon as any}
                                        size={24}
                                        color="#374151"
                                    />
                                    <Text className="ml-3 text-gray-700">
                                        {option.title}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#f5f7f9]">
            <StatusBar style="dark" />

            {/* Header with Gradient Background */}
            <LinearGradient
                colors={["#3b82f6", "#1d4ed8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="pt-14 pb-6 px-5"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Pressable
                            onPress={() =>
                                router.push("/(root)/sub-accounts/sub-accounts")
                            }
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <MaterialIcons
                                name="arrow-back"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                        <Text className="text-white text-lg font-bold ml-4">
                            Chi tiết tài khoản
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Pressable
                            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
                            onPress={() =>
                                router.push(
                                    "/(root)/notifications/notifications"
                                )
                            }
                        >
                            <MaterialIcons
                                name="notifications-none"
                                size={22}
                                color="white"
                            />
                        </Pressable>

                        <Pressable
                            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                            onPress={() => setShowMenu(true)}
                        >
                            <MaterialIcons
                                name="more-vert"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="p-4 mt-4 mx-4 items-center border-b border-gray-100 bg-white rounded-xl shadow-sm">
                    <Image
                        source={{ uri: account?.userDetail.avatarUrl }}
                        className="w-24 h-24 rounded-full mt-2"
                    />
                    <Text className="text-xl font-bold mt-3">
                        {account?.userDetail.lastName +
                            " " +
                            account?.userDetail.firstName}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <Text className="text-gray-600">
                            {new Date().getFullYear() -
                                new Date(
                                    account?.userDetail.dob
                                ).getFullYear()}{" "}
                            tuổi
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text
                            className={`${
                                account?.userDetail.gender == "MALE"
                                    ? "text-blue-600"
                                    : "text-pink-600"
                            }`}
                        >
                            {account?.userDetail.gender == "MALE"
                                ? "Nam"
                                : "Nữ"}
                        </Text>
                    </View>
                    <View className="flex-row px-2 my-4">
                        <Pressable
                            className="bg-blue-500 p-2 mx-2 rounded-xl flex-row items-center justify-center px-4"
                            onPress={() =>
                                router.push(
                                    "/purchased-courses/purchased-courses" as any
                                )
                            }
                        >
                            <MaterialIcons
                                name="school"
                                size={20}
                                color="#fff"
                            />
                            <Text className="text-white font-medium ml-2">
                                Gán khóa học
                            </Text>
                        </Pressable>
                        <Pressable
                            className="bg-gray-100 p-2 mx-2 rounded-xl flex-row items-center justify-center px-4"
                            onPress={() =>
                                router.push({
                                    pathname: "/sub-accounts/edit/[id]",
                                    params: { id: account.id },
                                })
                            }
                        >
                            <MaterialIcons
                                name="edit"
                                size={20}
                                color="#374151"
                            />
                            <Text className="text-gray-700 font-medium ml-2">
                                Chỉnh sửa
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Learning Stats */}
                <View className="p-4 mt-4 mx-4 bg-white rounded-xl shadow-sm">
                    <Text className="text-lg font-bold mb-4">
                        Thống kê học tập
                    </Text>
                    <View className="flex-row -mx-2">
                        <View className="flex-1 px-2">
                            <View className="bg-blue-50 p-4 rounded-xl">
                                <View className="flex-row items-center">
                                    <View className="mt-2 w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
                                        <MaterialIcons
                                            name="school"
                                            size={24}
                                            color="#3B82F6"
                                        />
                                    </View>
                                    <Text className="text-2xl font-bold ml-4">
                                        {childCourse.data.courses.length}
                                    </Text>
                                </View>
                                <Text className="text-gray-600">
                                    Khóa học đang học
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 px-2">
                            <View className="bg-purple-50 p-4 rounded-xl">
                                <View className="flex-row items-center">
                                    <View className="mt-2 w-10 h-10 bg-purple-100 rounded-full items-center justify-center mb-2">
                                        <MaterialIcons
                                            name="trending-up"
                                            size={24}
                                            color="#9333EA"
                                        />
                                    </View>
                                    <Text className="text-2xl font-bold ml-2">
                                        {childCourse.data.courses.length > 0
                                            ? Math.round(
                                                  childCourse.data.courses.reduce(
                                                      (sum: number, course) =>
                                                          sum +
                                                          (course.completionRate ||
                                                              0),
                                                      0
                                                  ) /
                                                      childCourse.data.courses
                                                          .length
                                              )
                                            : 0}{" "}
                                        %
                                    </Text>
                                </View>
                                <Text className="text-gray-600">
                                    Tiến độ trung bình
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Active Courses */}
                <View className="p-4 mt-4 mx-4 mb-6 bg-white rounded-xl shadow-sm">
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

                    {childCourse.data.courses.map((course) => (
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
                                    source={{ uri: course.imageUrl }}
                                    className="w-20 h-20 rounded-lg"
                                />
                                <View className="ml-3 flex-1">
                                    <Text
                                        className="font-bold"
                                        numberOfLines={2}
                                    >
                                        {course.title}
                                    </Text>
                                    <View className="flex-row items-center my-2">
                                        <MaterialIcons
                                            name="schedule"
                                            size={16}
                                            color="#6B7280"
                                        />
                                        <Text className="text-gray-600 ml-1">
                                            {formatDuration(
                                                course.durationDisplay
                                            )}
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
                                            {course.level == null
                                                ? "Chưa có cấp độ"
                                                : course.level == "ALL"
                                                ? "Tất cả"
                                                : course.level == "BEGINNER"
                                                ? "Khởi đầu"
                                                : course.level == "INTERMEDIATE"
                                                ? "Trung cấp"
                                                : "Nâng cao"}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons
                                            name="tag-outline"
                                            size={16}
                                            color="#6B7280"
                                        />
                                        {!course.categories.length ? (
                                            <View className="bg-orange-200 px-1 rounded-2xl ml-2">
                                                <Text className="text-gray-500 px-1 py-1 rounded-md">
                                                    --
                                                </Text>
                                            </View>
                                        ) : (
                                            <View className="flex-row flex-wrap">
                                                {course.categories
                                                    .slice(0, 2)
                                                    .map((category) => (
                                                        <View
                                                            key={category.id}
                                                            className="bg-orange-200 px-2 py-1 rounded-2xl ml-2"
                                                        >
                                                            <Text className="text-gray-500">
                                                                {category.name}
                                                            </Text>
                                                        </View>
                                                    ))}

                                                {course.categories.length >
                                                    2 && (
                                                    <View className="bg-orange-200 px-2 py-1 rounded-2xl ml-2">
                                                        <Text className="text-gray-500">
                                                            ...
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
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
                                        {course.completionRate || 0}%
                                    </Text>
                                </View>
                                <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <View
                                        className="bg-blue-500 h-full rounded-full"
                                        style={{
                                            width: `${
                                                course.completionRate || 0
                                            }%`,
                                        }}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* Menu Dropdown */}
            <Modal
                visible={showMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMenu(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50"
                    onPress={() => setShowMenu(false)}
                >
                    <View
                        className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl w-64"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        {MENU_OPTIONS.map((option, index) => (
                            <Pressable
                                key={option.id}
                                onPress={() => {
                                    setShowMenu(false);
                                    router.replace(option.route as any);
                                }}
                                className={`flex-row items-center p-4 ${
                                    index !== MENU_OPTIONS.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }`}
                            >
                                <MaterialIcons
                                    name={option.icon as any}
                                    size={24}
                                    color="#374151"
                                />
                                <Text className="ml-3 text-gray-700">
                                    {option.title}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
