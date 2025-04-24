import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { myCourseRes } from "@/schema/user-schema";
import { GetMyCoursesResType } from "@/schema/user-schema";
import { useAppStore } from "@/components/app-provider";
import { useMyCourse, useChildProfileAtChild } from "@/queries/useUser";
import formatDuration from "@/util/formatDuration";
import { MOCK_CHILD } from "@/constants/mock-data";

const STATUS_FILTERS = [
    { id: "all", label: "Tất cả" },
    { id: "PROCESSING", label: "Đang học" },
    { id: "PENDING", label: "Chưa học" },
    { id: "COMPLETED", label: "Hoàn thành" },
] as const;

export default function ChildMyCoursesScreen() {
    const accessToken = useAppStore((state) => state.accessToken);
    const token = accessToken == undefined ? "" : accessToken.accessToken;
    const {
        data: profileData,
        isError: isProfileError,
        isLoading: profileLoading,
    } = useChildProfileAtChild({ token: token ? token : "", enabled: true });

    // Lấy tên người dùng
    const firstName = profileData?.data.firstName || "Bạn";
    const lastName = profileData?.data.lastName || "";

    const [selectedStatus, setSelectedStatus] = useState<
        "all" | "COMPLETED" | "PROCESSING" | "PENDING"
    >("all");

    const {
        data: myCourseData,
        isLoading: myCourseLoading,
        isError: myCourseError,
        refetch,
    } = useMyCourse({
        token: token as string,
    });
    useFocusEffect(() => {
        refetch();
    });

    let myCourse: GetMyCoursesResType["data"] = [];

    if (myCourseData && !myCourseError) {
        if (myCourseData.data.length === 0) {
        } else {
            const parsedResult = myCourseRes.safeParse(myCourseData);
            if (parsedResult.success) {
                myCourse = parsedResult.data.data.filter(
                    (course) => course.isVisible === true
                );
            } else {
                console.error("Validation errors:", parsedResult.error.errors);
            }
        }
    }

    if (myCourseLoading || profileLoading) return <ActivityIndicatorScreen />;
    if (myCourseError) console.log("Lỗi khi tải dữ liệu khóa học");
    // return <ErrorScreen message="Lỗi khi tải dữ liệu khóa học" />;

    if (myCourse.length == 0) {
        return (
            <View className="flex-1 bg-gray-50">
                {/* Top SafeArea với background violet */}
                <View className="bg-violet-500">
                    <SafeAreaView edges={["top"]} className="bg-violet-500" />
                </View>
                <ScrollView>
                    {/* Header */}
                    <View className="px-4 pt-4 pb-8 bg-violet-500">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-white text-xl font-bold">
                                    Khóa học của tôi
                                </Text>
                                <Text className="text-white/80 mt-1">
                                    Tiếp tục học tập nào!
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
                    </View>

                    {/* Main Content with rounded top corners */}
                    <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-8">
                        <View className="flex-1 items-center justify-center p-4">
                            <MaterialIcons
                                name="school"
                                size={64}
                                color="#9CA3AF"
                            />
                            <Text className="text-gray-500 text-lg mt-4 text-center">
                                Bạn chưa đăng kí khóa học nào?
                            </Text>
                            <Pressable
                                className="mt-4 bg-violet-500 px-6 py-3 rounded-xl"
                                onPress={() =>
                                    router.push("/child/(tabs)/course")
                                }
                            >
                                <Text className="text-white font-bold">
                                    Đăng kí ngay!
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const filteredCourses = myCourse.filter((course) => {
        // Quy đổi completionRate thành trạng thái
        let courseStatus = "PENDING"; // Mặc định là PENDING
        if (course.completionRate === null || course.completionRate === 0) {
            courseStatus = "PENDING";
        } else if (course.completionRate >= 1 && course.completionRate <= 99) {
            courseStatus = "PROCESSING";
        } else if (course.completionRate === 100) {
            courseStatus = "COMPLETED";
        }

        // Kiểm tra điều kiện lọc
        return selectedStatus === "all" || courseStatus === selectedStatus;
    });

    return (
        <View className="flex-1 bg-gray-50">
            {/* Top SafeArea với background violet */}
            <View className="bg-violet-500">
                <SafeAreaView edges={["top"]} className="bg-violet-500" />
            </View>
            <ScrollView>
                {/* Header */}
                <View className="px-4 pt-4 pb-8 bg-violet-500">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-white text-xl font-bold">
                                Khóa học của tôi
                            </Text>
                            <Text className="text-white/80 mt-1">
                                Tiếp tục học tập nào!
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
                </View>

                {/* Main Content with rounded top corners */}
                <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-6">
                    {/* Status Filters */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pl-5"
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {STATUS_FILTERS.map((filter, index) => (
                            <Pressable
                                key={filter.id}
                                className={`px-4 py-2 rounded-xl ${
                                    selectedStatus === filter.id
                                        ? "bg-violet-500"
                                        : "bg-white border border-gray-200"
                                } ${
                                    index === STATUS_FILTERS.length - 1
                                        ? "mr-5"
                                        : "mr-2"
                                }`}
                                onPress={() => setSelectedStatus(filter.id)}
                            >
                                <Text
                                    className={
                                        selectedStatus === filter.id
                                            ? "text-white font-medium"
                                            : "text-gray-700"
                                    }
                                >
                                    {filter.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Course List */}
                    <View className="px-5 pt-6 pb-20">
                        {filteredCourses.length === 0 ? (
                            <View className="items-center justify-center py-8">
                                <MaterialIcons
                                    name="search-off"
                                    size={64}
                                    color="#9CA3AF"
                                />
                                <Text className="text-gray-500 text-lg mt-4 text-center">
                                    Không tìm thấy khóa học nào
                                </Text>
                                <Pressable
                                    className="mt-4 bg-violet-500 px-4 py-2 rounded-xl"
                                    onPress={() => setSelectedStatus("all")}
                                >
                                    <Text className="text-white font-medium">
                                        Xem tất cả
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            filteredCourses.map((course) => (
                                <Pressable
                                    key={course.id}
                                    className="bg-white rounded-2xl border border-gray-100 mb-5 shadow-sm overflow-hidden"
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/child/learn/course/[courseId]",
                                            params: { courseId: course.id },
                                        })
                                    }
                                >
                                    {/* Course Thumbnail */}
                                    <Image
                                        source={{ uri: course.imageUrl }}
                                        className="w-full h-40"
                                        resizeMode="cover"
                                    />

                                    {/* Course Info */}
                                    <View className="p-5">
                                        <View className="flex-row flex-wrap gap-2 mb-3">
                                            {!course.categories.length ? (
                                                <View className="bg-violet-50 rounded-lg px-3 py-1.5">
                                                    <Text className="text-violet-700 text-xs font-medium">
                                                        --
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View className="flex-row flex-wrap gap-2">
                                                    {course.categories
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
                                                    {course.categories.length >
                                                        2 && (
                                                        <View className="bg-violet-50 rounded-lg px-3 py-1.5">
                                                            <Text className="text-violet-700 text-xs font-medium">
                                                                ...
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </View>

                                        <Text className="font-bold text-lg text-gray-900 mb-2">
                                            {course.title}
                                        </Text>
                                        <Text
                                            className="text-gray-600 mb-4"
                                            numberOfLines={2}
                                        >
                                            {course.description}
                                        </Text>

                                        {/* Course Details */}
                                        <View className="flex-row items-center gap-3 mb-4">
                                            <View className="flex-row items-center">
                                                <MaterialIcons
                                                    name="schedule"
                                                    size={16}
                                                    color="#6B7280"
                                                />
                                                <Text className="text-gray-600 ml-1 text-sm">
                                                    {(() => {
                                                        const duration =
                                                            course.durationDisplay;
                                                        const hours =
                                                            parseInt(
                                                                duration.split(
                                                                    "h"
                                                                )[0]
                                                            ) || 0;
                                                        const minutes =
                                                            parseInt(
                                                                duration
                                                                    .split(
                                                                        "h"
                                                                    )[1]
                                                                    .replace(
                                                                        "p",
                                                                        ""
                                                                    )
                                                            ) || 0;

                                                        const totalMinutes =
                                                            hours * 60 +
                                                            minutes;
                                                        const learnedMinutes =
                                                            Math.round(
                                                                (totalMinutes *
                                                                    course.completionRate) /
                                                                    100
                                                            );
                                                        const learnedHours =
                                                            Math.floor(
                                                                learnedMinutes /
                                                                    60
                                                            );
                                                        const remainingMinutes =
                                                            learnedMinutes % 60;

                                                        let learned = "";
                                                        if (learnedHours > 0) {
                                                            learned += `${learnedHours} giờ `;
                                                        }
                                                        if (
                                                            remainingMinutes >
                                                                0 ||
                                                            learned === ""
                                                        ) {
                                                            learned += `${remainingMinutes} phút`;
                                                        }
                                                        if (learned === "")
                                                            learned = "0 phút";

                                                        return `${learned} / ${formatDuration(
                                                            course.durationDisplay
                                                        )}`;
                                                    })()}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <MaterialIcons
                                                    name="person"
                                                    size={16}
                                                    color="#6B7280"
                                                />
                                                <Text className="text-gray-600 ml-1 text-sm">
                                                    {course.author}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Divider */}
                                        <View className="h-[1px] bg-gray-100 mb-4" />

                                        {/* Progress Bar and Button */}
                                        <View className="mb-3">
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-gray-600 text-sm">
                                                    Tiến độ
                                                </Text>
                                                <Text className="text-violet-600 font-medium text-sm">
                                                    {course.completionRate}%
                                                </Text>
                                            </View>
                                            <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <View
                                                    className={`h-full rounded-full ${
                                                        course.completionRate ===
                                                        100
                                                            ? "bg-green-500"
                                                            : "bg-violet-500"
                                                    }`}
                                                    style={{
                                                        width: `${course.completionRate}%`,
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        {/* Button */}
                                        <Pressable className="bg-violet-500 rounded-full py-2.5 px-5 flex-row justify-center items-center">
                                            <Text className="text-white font-medium text-sm">
                                                Tiếp tục học
                                            </Text>
                                            <MaterialIcons
                                                name="arrow-forward"
                                                size={16}
                                                color="#ffffff"
                                                style={{ marginLeft: 4 }}
                                            />
                                        </Pressable>
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
