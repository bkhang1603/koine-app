import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { myCourseRes } from "@/schema/user-schema";
import { GetMyCoursesResType } from "@/schema/user-schema";
import { useAppStore } from "@/components/app-provider";
import { useMyCourse } from "@/queries/useUser";
import formatDuration from "@/util/formatDuration";

const STATUS_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "PROCESSING", label: "Đang học" },
  { id: "PENDING", label: "Chưa học" },
  { id: "COMPLETED", label: "Hoàn thành" },
] as const;

export default function ChildMyCoursesScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
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

  if (myCourseLoading) return <ActivityIndicatorScreen />;
  if (myCourseError) console.log("Lỗi khi tải dữ liệu khóa học");
  // return <ErrorScreen message="Lỗi khi tải dữ liệu khóa học" />;

  if (myCourse.length == 0) {
    return (
      <View className="flex-1 bg-white">
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Khóa học của tôi</Text>
            <Text className="text-gray-600 mt-1">Tiếp tục học tập nào!</Text>
          </View>
          <View className="flex-row items-center">
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-2"
              onPress={() => router.push("/child/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="#374151" />
            </Pressable>
          </View>
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="school" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Bạn chưa đăng kí khóa học nào?
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/child/(tabs)/home")}
          >
            <Text className="text-white font-bold">Đăng kí ngay!</Text>
          </Pressable>
        </View>
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
    <ScrollView className="flex-1 pt-4 bg-white">
      <SafeAreaView>
        {/* Header */}
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Khóa học của tôi</Text>
            <Text className="text-gray-600 mt-1">Tiếp tục học tập nào!</Text>
          </View>
          <View className="flex-row items-center">
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-2"
              onPress={() => router.push("/child/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="#374151" />
            </Pressable>
          </View>
        </View>

        {/* filter */}
        <ScrollView
          className="px-4 pt-6"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {STATUS_FILTERS.map((filter) => (
            <Pressable
              key={filter.id}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedStatus === filter.id ? "bg-blue-500" : "bg-gray-100"
              }`}
              onPress={() => setSelectedStatus(filter.id)}
            >
              <Text
                className={
                  selectedStatus === filter.id
                    ? "text-white font-medium"
                    : "text-gray-600"
                }
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Course List */}
        <ScrollView className="flex-1">
          <View className="p-4">
            {filteredCourses.map((course) => (
              <View
                key={course.id}
                className="bg-white rounded-2xl border border-gray-100 mb-4 shadow-sm overflow-hidden"
              >
                {/* Course Thumbnail */}
                <Image
                  source={{ uri: course.imageUrl }}
                  className="w-full h-40"
                  resizeMode="cover"
                />

                {/* Course Info */}
                <View className="p-4">
                  <View className="flex-row flex-wrap gap-2 mb-1">
                  {!course.categories.length ? (
                      <View className="bg-blue-50 px-3 py-1 rounded-full">
                        <Text className="text-blue-600 text-xs font-medium">
                          --
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap gap-1">
                        {course.categories.slice(0, 4).map((category) => (
                          <View
                            key={category.id}
                            className="bg-blue-50 px-3 py-1 rounded-full"
                          >
                            <Text className="text-blue-600 text-xs font-medium">
                              {category.name}
                            </Text>
                          </View>
                        ))}
                        {course.categories.length > 4 && (
                          <View className="bg-blue-50 px-3 py-1 rounded-full">
                            <Text className="text-blue-600 text-xs font-medium">
                              ...
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-bold text-lg">{course.title}</Text>
                      <Text className="text-gray-600 mt-1">
                        {course.description}
                      </Text>
                    </View>
                  </View>

                  {/* Course Details */}
                  <View className="mt-4 flex-row items-center">
                    <MaterialIcons name="schedule" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">
                      {(() => {
                        const duration = course.durationDisplay;
                        const hours = parseInt(duration.split("h")[0]) || 0;
                        const minutes =
                          parseInt(duration.split("h")[1].replace("p", "")) ||
                          0;

                        const totalMinutes = hours * 60 + minutes;
                        const learnedMinutes = Math.round(
                          (totalMinutes * course.completionRate) / 100
                        );
                        const learnedHours = Math.floor(learnedMinutes / 60);
                        const remainingMinutes = learnedMinutes % 60;

                        let learned = "";
                        if (learnedHours > 0) {
                          learned += `${learnedHours} giờ `;
                        }
                        if (remainingMinutes > 0 || learned === "") {
                          learned += `${remainingMinutes} phút`;
                        }
                        if (learned === "") learned = "0 phút";

                        return `${learned} / ${formatDuration(
                          course.durationDisplay
                        )}`;
                      })()}
                    </Text>
                  </View>
                  <Text className="text-gray-600">
                    Tác giả: {course.author}
                  </Text>

                  {/* Progress Bar */}
                  <View className="mt-4">
                    <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <View
                        className={`h-full rounded-full ${
                          course.completionRate === 100
                            ? "bg-green-500"
                            : "bg-violet-500"
                        }`}
                        style={{
                          width: `${course.completionRate}%`,
                        }}
                      />
                    </View>
                    <Text className="text-gray-600 mt-2">
                      {course.completionRate}% hoàn thành
                    </Text>
                  </View>

                  {/* Continue Button */}
                  <Pressable
                    className="bg-violet-500 p-3 rounded-xl mt-4 flex-row items-center justify-center"
                    onPress={() =>
                      router.push({
                        pathname: "/child/learn/course/[courseId]",
                        params: { courseId: course.id },
                      })
                    }
                  >
                    <Text className="text-white font-bold">Tiếp tục học</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
}
