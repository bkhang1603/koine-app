import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CartButton from "@/components/CartButton";
import { useCourses } from "@/queries/useCourse";
import { courseRes, GetAllCourseResType } from "@/schema/course-schema";
import { useAppStore } from "@/components/app-provider";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import ErrorScreen from "@/components/ErrorScreen";
import formatDuration from "@/util/formatDuration";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MOCK_CHILD } from "@/constants/mock-data";

const CATEGORIES = ["Tất cả", "Sức khỏe", "Tâm lý", "Kỹ năng", "Giáo dục"];

export default function CourseScreen() {
    const accessToken = useAppStore((state) => state.accessToken);
    const token = accessToken == undefined ? "" : accessToken.accessToken;
    const profile = useAppStore((state) => state.profile);

    // Lấy initial từ tên người dùng
    const firstName = profile?.data.firstName || "Bạn";
    const lastName = profile?.data.lastName || "";

    const {
        data: coursesData,
        isLoading: coursesLoading,
        isError: coursesError,
    } = useCourses({
        keyword: "",
        page_size: 10,
        page_index: 1,
    });

    const courses = useMemo(() => {
        let result: GetAllCourseResType["data"] = [];
        if (coursesData && !coursesError) {
            if (coursesData.data.length !== 0) {
                const parsedResult = courseRes.safeParse(coursesData);
                if (parsedResult.success) {
                    result = parsedResult.data.data;
                } else {
                    console.error(
                        "Validation errors:",
                        parsedResult.error.errors
                    );
                }
            }
        }
        return result;
    }, [coursesData, coursesError]);

    const [selectedCategory, setSelectedCategory] = useState("Tất cả");

    if (!courses.length) {
        return (
            <View className="flex-1 bg-gray-50">
                {/* Top SafeArea với background violet */}
                <View className="bg-violet-500">
                    <SafeAreaView edges={["top"]} className="bg-violet-500" />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className="px-4 pt-4 pb-8 bg-violet-500">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-white text-xl font-bold">
                                    Khóa học
                                </Text>
                                <Text className="text-white/80 mt-1">
                                    Khám phá nhiều loại khóa học
                                </Text>
                            </View>
                            <View className="flex-row">
                                <Pressable
                                    className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
                                    onPress={() =>
                                        router.push("/child/notifications")
                                    }
                                >
                                    <MaterialIcons
                                        name="notifications"
                                        size={24}
                                        color="white"
                                    />
                                    <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                                        <Text className="text-white text-xs font-bold">
                                            3
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    className="w-10 h-10 ml-2 bg-violet-400/50 rounded-full items-center justify-center"
                                    onPress={() =>
                                        router.push("/child/event/event")
                                    }
                                >
                                    <MaterialIcons
                                        name="event-available"
                                        size={24}
                                        color="white"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <Pressable
                            className="bg-violet-400/50 rounded-xl p-3.5 mt-6 flex-row items-center"
                            onPress={() =>
                                router.push("/child/search/searchCourse")
                            }
                        >
                            <MaterialIcons
                                name="search"
                                size={20}
                                color="white"
                            />
                            <Text className="ml-2 text-white/90 flex-1">
                                Tìm kiếm khóa học...
                            </Text>
                        </Pressable>
                    </View>

                    {/* Empty States */}
                    <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-8">
                        <View className="flex-1 items-center justify-center p-8">
                            <MaterialIcons
                                name="school"
                                size={64}
                                color="#9CA3AF"
                            />
                            <Text className="text-gray-500 text-lg mt-4 text-center">
                                Danh sách khóa học đang trống
                            </Text>
                            <Pressable
                                className="mt-4 bg-violet-500 px-4 py-2 rounded-xl"
                                onPress={() =>
                                    router.push("/child/search/searchCourse")
                                }
                            >
                                <Text className="text-white font-medium">
                                    Tìm khóa học
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (coursesLoading) return <ActivityIndicatorScreen />;
    if (coursesError)
        return <ErrorScreen message="Lỗi khi tải dữ liệu khóa học" />;

    return (
        <View className="flex-1 bg-gray-50">
            {/* Top SafeArea với background violet */}
            <View className="bg-violet-500">
                <SafeAreaView edges={["top"]} className="bg-violet-500" />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 pt-4 pb-8 bg-violet-500">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-white text-xl font-bold">
                                Khóa học
                            </Text>
                            <Text className="text-white/80 mt-1">
                                Khám phá nhiều loại khóa học
                            </Text>
                        </View>
                        <View className="flex-row">
                            <Pressable
                                className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
                                onPress={() =>
                                    router.push("/child/notifications")
                                }
                            >
                                <MaterialIcons
                                    name="notifications"
                                    size={24}
                                    color="white"
                                />
                                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                                    <Text className="text-white text-xs font-bold">
                                        3
                                    </Text>
                                </View>
                            </Pressable>

                            <Pressable
                                className="w-10 h-10 ml-2 bg-violet-400/50 rounded-full items-center justify-center"
                                onPress={() =>
                                    router.push("/child/event/event")
                                }
                            >
                                <MaterialIcons
                                    name="event-available"
                                    size={24}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    </View>

                    <Pressable
                        className="bg-violet-400/50 rounded-xl p-3.5 mt-6 flex-row items-center"
                        onPress={() =>
                            router.push("/child/search/searchCourse")
                        }
                    >
                        <MaterialIcons name="search" size={20} color="white" />
                        <Text className="ml-2 text-white/90 flex-1">
                            Tìm kiếm khóa học...
                        </Text>
                    </Pressable>
                </View>

                {/* Main Content with rounded top corners */}
                <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-8">
                    {/* Categories */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pl-5"
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {CATEGORIES.map((category, index) => (
                            <Pressable
                                key={category}
                                onPress={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-xl ${
                                    selectedCategory === category
                                        ? "bg-violet-500"
                                        : "bg-white border border-gray-200"
                                } ${
                                    index === CATEGORIES.length - 1
                                        ? "mr-5"
                                        : "mr-2"
                                }`}
                            >
                                <Text
                                    className={
                                        selectedCategory === category
                                            ? "text-white font-medium"
                                            : "text-gray-700"
                                    }
                                >
                                    {category}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Featured Course */}
                    {courses && (
                        <View className="px-5 mt-6">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-xl font-bold">
                                    Khóa học nổi bật
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        /* Xem tất cả */
                                    }}
                                >
                                    <Text className="text-violet-500 font-medium">
                                        Xem tất cả
                                    </Text>
                                </Pressable>
                            </View>
                            <Pressable
                                className="bg-white rounded-2xl overflow-hidden"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#f1f5f9",
                                }}
                                onPress={() =>
                                    router.push({
                                        pathname: "/child/courses/[id]",
                                        params: { id: courses[0].id },
                                    })
                                }
                            >
                                <View>
                                    {/* Top Section with Image */}
                                    <Image
                                        source={{
                                            uri:
                                                courses[0].imageUrl ??
                                                "https://thumbs.dreamstime.com/b/orange-cosmos-flower-bud-garden-indiana-39358565.jpg",
                                        }}
                                        className="w-full h-48"
                                        style={{ resizeMode: "cover" }}
                                    />

                                    {/* Content Section */}
                                    <View className="p-5">
                                        {/* Category */}
                                        <View className="flex-row flex-wrap gap-2 mb-3">
                                            {!courses[0].categories.length ? (
                                                <View className="bg-violet-50 rounded-lg px-3 py-1.5">
                                                    <Text className="text-violet-700 text-xs font-medium">
                                                        --
                                                    </Text>
                                                </View>
                                            ) : (
                                                <>
                                                    {courses[0].categories
                                                        .slice(0, 2)
                                                        .map((category) => (
                                                            <View
                                                                key={
                                                                    category.id
                                                                }
                                                                className="bg-violet-50 rounded-lg px-3 py-1.5"
                                                            >
                                                                <Text className="text-violet-700 text-xs font-medium">
                                                                    {
                                                                        category.name
                                                                    }
                                                                </Text>
                                                            </View>
                                                        ))}
                                                    {courses[0].categories
                                                        .length > 2 && (
                                                        <View className="bg-violet-50 rounded-lg px-3 py-1.5">
                                                            <Text className="text-violet-700 text-xs font-medium">
                                                                ...
                                                            </Text>
                                                        </View>
                                                    )}
                                                </>
                                            )}
                                        </View>

                                        {/* Title and Description */}
                                        <Text className="text-lg font-bold text-gray-900 mb-2">
                                            {courses[0].title}
                                        </Text>
                                        <Text
                                            className="text-gray-600 mb-4 leading-5"
                                            numberOfLines={2}
                                        >
                                            {courses[0].description}
                                        </Text>

                                        {/* Stats */}
                                        <View className="flex-row items-center gap-3 mb-4">
                                            <View className="flex-row items-center">
                                                <MaterialIcons
                                                    name="schedule"
                                                    size={16}
                                                    color="#6B7280"
                                                />
                                                <Text className="text-gray-600 ml-1 text-sm">
                                                    {formatDuration(
                                                        courses[0]
                                                            .durationsDisplay
                                                    )}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <MaterialIcons
                                                    name="star"
                                                    size={16}
                                                    color="#F59E0B"
                                                />
                                                <Text className="text-gray-600 ml-1 text-sm">
                                                    {courses[0].aveRating == 0
                                                        ? 5
                                                        : courses[0].aveRating}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <MaterialIcons
                                                    name="people"
                                                    size={16}
                                                    color="#8B5CF6"
                                                />
                                                <Text className="text-gray-600 ml-1 text-sm">
                                                    {courses[0].totalEnrollment}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Divider */}
                                        <View className="h-[1px] bg-gray-100 mb-4" />

                                        {/* Footer */}
                                        <View className="flex-row justify-between items-center">
                                            <Text
                                                className={`text-lg font-bold ${
                                                    courses[0].price === 0
                                                        ? "text-green-500"
                                                        : "text-violet-600"
                                                }`}
                                            >
                                                {courses[0].price !== 0
                                                    ? courses[0].price.toLocaleString(
                                                          "vi-VN"
                                                      ) + " ₫"
                                                    : "Miễn phí"}
                                            </Text>

                                            <Pressable className="bg-violet-500 rounded-full py-2.5 px-5 flex-row justify-center items-center">
                                                <Text className="text-white font-medium text-sm">
                                                    Xem chi tiết
                                                </Text>
                                                <MaterialIcons
                                                    name="arrow-forward"
                                                    size={16}
                                                    color="#ffffff"
                                                    style={{ marginLeft: 4 }}
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    )}

                    {/* Course List - Vertically Scrollable */}
                    <View className="mt-8 px-5 mb-20">
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-xl font-bold">
                                Tất cả khóa học
                            </Text>
                            <Pressable
                                onPress={() => {
                                    /* Xem tất cả */
                                }}
                            >
                                <Text className="text-violet-500 font-medium">
                                    Xem tất cả
                                </Text>
                            </Pressable>
                        </View>

                        <View className="space-y-4">
                            {courses.map((course) => (
                                <Pressable
                                    key={course.id}
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                                    onPress={() =>
                                        router.push({
                                            pathname: "/child/courses/[id]",
                                            params: { id: course.id },
                                        })
                                    }
                                >
                                    <View className="flex-row">
                                        {/* Phần hình ảnh bên trái */}
                                        <View
                                            className="relative"
                                            style={{ width: 120 }}
                                        >
                                            <Image
                                                source={{
                                                    uri:
                                                        course.imageUrl ??
                                                        "https://thumbs.dreamstime.com/b/orange-cosmos-flower-bud-garden-indiana-39358565.jpg",
                                                }}
                                                className="w-full h-full absolute"
                                                style={{
                                                    height: "100%",
                                                    resizeMode: "cover",
                                                }}
                                            />
                                            {course.categories.length > 0 && (
                                                <View className="absolute top-3 left-3 bg-violet-500/90 rounded-lg px-2 py-0.5">
                                                    <Text className="text-white text-xs font-medium">
                                                        {
                                                            course.categories[0]
                                                                .name
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Phần nội dung bên phải */}
                                        <View className="flex-1 p-3">
                                            <Text
                                                className="font-bold text-gray-900 text-base mb-1.5"
                                                numberOfLines={2}
                                            >
                                                {course.title}
                                            </Text>

                                            {/* Thống kê khóa học */}
                                            <View className="flex-row flex-wrap items-center gap-3 mb-2">
                                                <View className="flex-row items-center">
                                                    <MaterialIcons
                                                        name="schedule"
                                                        size={14}
                                                        color="#6B7280"
                                                    />
                                                    <Text className="text-gray-500 text-xs ml-1">
                                                        {formatDuration(
                                                            course.durationsDisplay
                                                        )}
                                                    </Text>
                                                </View>
                                                <View className="flex-row items-center">
                                                    <MaterialIcons
                                                        name="star"
                                                        size={14}
                                                        color="#F59E0B"
                                                    />
                                                    <Text className="text-gray-500 text-xs ml-1">
                                                        {course.aveRating == 0
                                                            ? "5.0"
                                                            : course.aveRating.toFixed(
                                                                  1
                                                              )}
                                                    </Text>
                                                </View>
                                                <View className="flex-row items-center">
                                                    <MaterialIcons
                                                        name="people"
                                                        size={14}
                                                        color="#8B5CF6"
                                                    />
                                                    <Text className="text-gray-500 text-xs ml-1">
                                                        {course.totalEnrollment}{" "}
                                                        học viên
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Footer với giá và nút đăng ký */}
                                            <View className="flex-row items-center justify-between mt-1.5">
                                                <Text
                                                    className={`font-bold text-base ${
                                                        course.price === 0
                                                            ? "text-green-500"
                                                            : "text-violet-600"
                                                    }`}
                                                >
                                                    {course.price !== 0
                                                        ? course.price.toLocaleString(
                                                              "vi-VN"
                                                          ) + " ₫"
                                                        : "Miễn phí"}
                                                </Text>
                                                <Pressable className="bg-violet-50 px-3 py-1.5 rounded-full">
                                                    <Text className="text-violet-600 text-xs font-medium">
                                                        Xem chi tiết
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
