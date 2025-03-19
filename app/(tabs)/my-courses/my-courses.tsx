import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_MY_COURSES } from "@/constants/mock-data";
import { useAppStore } from "@/components/app-provider";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { GetMyCoursesResType, myCourseRes } from "@/schema/user-schema";
import { useMyCourse } from "@/queries/useUser";
import CartButton from "@/components/CartButton";
import { useFocusEffect } from "expo-router";
import formatDuration from "@/util/formatDuration";

export default function MyCoursesScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

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
        myCourse = parsedResult.data.data;
      } else {
        console.error("Validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (myCourseLoading) return <ActivityIndicatorScreen />;
  if (myCourseError) return null;

  // console.log("Fetched Data:", JSON.stringify(myCourseData, null, 2));
  // console.log("Fetched Data:", JSON.stringify(token, null, 2));

  return (
    <ScrollView className="flex-1 pt-4 bg-white">
      <SafeAreaView>
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Khóa học của tôi</Text>
            <Text className="text-gray-600 mt-1">Tiếp tục học tập nào!</Text>
          </View>
          <View className="flex-row items-center">
            <CartButton />
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-2"
              onPress={() => router.push("/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="#374151" />
            </Pressable>
          </View>
        </View>
        <View className="px-4 pt-6">
          {myCourse.map((course) => (
            <Pressable
              key={course.id}
              className="bg-white rounded-2xl mb-6 border border-gray-100 shadow-sm overflow-hidden"
              onPress={() =>
                router.push({
                  pathname: "/learn/course/[courseId]" as any,
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
              <View className="p-4">
                <View className="flex-row flex-wrap gap-2 mb-1">
                  {course.categories.map((category) => (
                    <View
                      key={category.id}
                      className="bg-blue-50 px-3 py-1 rounded-full"
                    >
                      <Text className="text-blue-600 text-xs font-medium">
                        {category.name}
                      </Text>
                    </View>
                  ))}
                </View>
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-bold text-lg">{course.title}</Text>
                    <Text className="text-gray-600 mt-1">
                      {course.description.length > 50
                        ? course.description.substring(0, 100) + "..."
                        : course.description}
                    </Text>
                  </View>
                </View>

                {/* Course Details */}
                <View className="mt-4 ">
                  <Text className="text-gray-600">
                    Thời gian học:
                    {(() => {
                      const duration = course.durationDisplay;
                      const hours = parseInt(duration.split("h")[0]) || 0;
                      const minutes =
                        parseInt(duration.split("h")[1].replace("p", "")) || 0;

                      const totalMinutes = hours * 60 + minutes;
                      const learnedMinutes = Math.round(
                        (totalMinutes * (course.completionRate || 0)) / 100
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

                      return ` ${learned} / ${formatDuration(
                        course.durationDisplay
                      )}`;
                    })()}
                  </Text>

                  <Text className="text-gray-600">
                    Tác giả: {course.author}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="mt-4">
                  <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <View
                      className={`h-full rounded-full ${
                        course.completionRate === 100
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.max(2, course.completionRate || 0)}%`,
                        opacity: course.completionRate === 0 ? 0.5 : 1,
                      }}
                    />
                  </View>
                  <Text className="text-gray-600 mt-2">
                    {course.completionRate || 0}% hoàn thành
                  </Text>
                </View>

                {/* Continue Button */}
                <Pressable
                  className="bg-blue-500 p-3 rounded-xl mt-4 flex-row items-center justify-center"
                  onPress={() =>
                    router.push({
                      pathname: "/learn/course/[courseId]" as any,
                      params: { courseId: course.id },
                    })
                  }
                >
                  <Text className="text-white font-bold">Tiếp tục học</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
        <View className="h-20"></View>
      </SafeAreaView>
    </ScrollView>
  );
}
