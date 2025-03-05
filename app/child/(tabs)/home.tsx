import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_CHILD } from "@/constants/mock-data";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/components/app-provider";
import { useChildProfileAtChild} from "@/queries/useUser";

export default function HomeScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const {
    data: profileData,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useChildProfileAtChild({ token: token ? token : "", enabled: true });

  useEffect(() => {
    refetchProfile();
  }, [token]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top SafeArea với background violet */}
      <View className="bg-violet-500">
        <SafeAreaView edges={["top"]} className="bg-violet-500" />
      </View>

      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-8 bg-violet-500">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Image
                source={{ uri: profileData?.data.avatarUrl }}
                className="w-14 h-14 rounded-full border-2 border-white"
              />
              <View className="ml-3">
                <Text className="text-white text-lg font-bold">
                  Xin chào, {profileData?.data.lastName + " " + profileData?.data.firstName}! 👋
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="stars" size={16} color="#FCD34D" />
                  <Text className="text-white/90 ml-1">
                    {MOCK_CHILD.points} điểm
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
              onPress={() => router.push("/child/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
            </Pressable>
          </View>

          {/* Streak Card */}
          <View className="bg-violet-400/50 rounded-2xl p-4 mt-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialIcons
                  name="local-fire-department"
                  size={28}
                  color="#FCD34D"
                />
                <View className="ml-3">
                  <Text className="text-white font-bold text-lg">
                    {MOCK_CHILD.streakDays} ngày liên tiếp
                  </Text>
                  <Text className="text-white/80">Giữ vững phong độ nhé!</Text>
                </View>
              </View>
              <View className="bg-yellow-500 w-12 h-12 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-lg">🔥</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="bg-gray-50 rounded-t-3xl flex-1 pt-6">
          {/* Continue Learning */}
          <View className="px-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold">Tiếp tục học tập</Text>
              <Pressable
                className="flex-row items-center"
                onPress={() => router.push("/child/(tabs)/my-courses")}
              >
                <Text className="text-violet-500 mr-1">Xem tất cả</Text>
                <MaterialIcons name="chevron-right" size={20} color="#7C3AED" />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4"
            >
              {MOCK_CHILD.activeCourses.map((course) => (
                <Pressable
                  key={course.id}
                  className="mr-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  style={{ width: 280 }}
                  onPress={() =>
                    router.push({
                      pathname: "/child/courses/[courseId]/lessons/[lessonId]",
                      params: {
                        courseId: course.id,
                        lessonId: course.lastLesson.id,
                      },
                    })
                  }
                >
                  <Image
                    source={{ uri: course.thumbnail }}
                    className="w-full h-36"
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <Text className="font-bold text-lg" numberOfLines={1}>
                      {course.title}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center">
                        <MaterialIcons
                          name="play-circle-fill"
                          size={16}
                          color="#7C3AED"
                        />
                        <Text className="text-violet-600 text-sm ml-1">
                          Bài {course.completedLessons + 1}
                        </Text>
                      </View>
                      <Text className="text-gray-500 text-sm">
                        {course.lastLesson.duration}
                      </Text>
                    </View>
                    <View className="mt-3">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-500 text-sm">
                          {course.completedLessons}/{course.totalLessons} bài
                          học
                        </Text>
                        <Text className="text-violet-600 font-medium">
                          {course.progress}%
                        </Text>
                      </View>
                      <View className="bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-violet-500 rounded-full"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Daily Tasks */}
          <View className="mt-8 px-4">
            <Text className="text-lg font-bold mb-4">Nhiệm vụ hôm nay</Text>
            {MOCK_CHILD.dailyTasks.map((task) => (
              <View
                key={task.id}
                className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-violet-100 rounded-2xl items-center justify-center">
                    <MaterialIcons
                      name={task.icon as any}
                      size={28}
                      color="#7C3AED"
                    />
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-bold text-base">{task.title}</Text>
                      <View className="bg-violet-100 px-2 py-1 rounded-lg">
                        <Text className="text-violet-600 font-medium">
                          +{task.points}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-500 text-sm mt-1">
                      {task.description}
                    </Text>
                  </View>
                </View>
                <View className="mt-3">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500 text-sm">Tiến độ</Text>
                    <Text className="text-violet-600 font-medium">
                      {task.progress}/{task.total}
                    </Text>
                  </View>
                  <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-violet-500 rounded-full"
                      style={{
                        width: `${(task.progress / task.total) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View className="mt-8 px-4 pb-4">
            <Text className="text-lg font-bold mb-4">Khám phá thêm</Text>
            <View className="flex-row flex-wrap -mx-2">
              {[
                {
                  id: "games",
                  title: "Trò chơi",
                  description: "Học qua game",
                  icon: "sports-esports",
                  color: "bg-green-500",
                  route: "/child/(tabs)/games",
                },
                {
                  id: "achievements",
                  title: "Thành tích",
                  description: "Xem huy hiệu",
                  icon: "emoji-events",
                  color: "bg-yellow-500",
                  route: "/child/achievements",
                },
              ].map((action) => (
                <Pressable
                  key={action.id}
                  className="w-1/2 p-2"
                  onPress={() => router.push(action.route as any)}
                >
                  <View className={`${action.color} p-4 rounded-2xl`}>
                    <MaterialIcons
                      name={action.icon as any}
                      size={28}
                      color="white"
                    />
                    <Text className="text-white font-bold mt-2">
                      {action.title}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      {action.description}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
            <View className="h-20"></View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom SafeArea với background trắng */}
      <SafeAreaView edges={["bottom"]} className="bg-gray-50" />
    </View>
  );
}
