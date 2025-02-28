import React, { useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useMyChildCourses } from "@/queries/useUser";

export default function SubAccountDetailScreen() {
  const { id } = useLocalSearchParams();
  const childs = useAppStore((state) => state.childs);
  const account = childs?.find((child) => child.id == id);
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  if (!account) return null;
  const {
    data: childCourse,
    isError,
    refetch,
  } = useMyChildCourses({ childId: account.id, token: token });

  useFocusEffect(() => {
    refetch();
  });

  if (!childCourse || childCourse.data.length == 0) {
    return (
      <View className="flex-1 bg-white">
        <HeaderWithBack
          title="Chi tiết tài khoản"
          returnTab={"/(root)/purchased-courses/purchased-courses"}
        />
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="school" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Chưa gán cho {account.userDetail.firstName} khóa học nào
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() =>
              router.push("/(root)/purchased-courses/purchased-courses")
            }
          >
            <Text className="text-white font-bold">Gán ngay?</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Chi tiết tài khoản"
        returnTab={"/(root)/purchased-courses/purchased-courses"}
      />
      <ScrollView>
        {/* Profile Header */}
        <View className="p-4 items-center border-b border-gray-100">
          <Image
            source={{ uri: account?.userDetail.avatarUrl }}
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-xl font-bold mt-3">
            {account?.userDetail.lastName + " " + account?.userDetail.firstName}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-600">
              {new Date().getFullYear() -
                new Date(account?.userDetail.dob).getFullYear()}{" "}
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
              {account?.userDetail.gender == "MALE" ? "Nam" : "Nữ"}
            </Text>
          </View>
        </View>

        {/* Learning Stats */}
        <View className="p-4 bg-blue-50">
          <Text className="text-lg font-bold mb-4">Thống kê học tập</Text>
          <View className="flex-row -mx-2">
            <View className="flex-1 px-2">
              <View className="bg-white p-4 rounded-xl">
                <View className="flex-row items-center">
                  <View className="mt-2 w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
                    <MaterialIcons name="school" size={24} color="#3B82F6" />
                  </View>
                  <Text className="text-2xl font-bold ml-4">
                    {childCourse.data.length}
                  </Text>
                </View>
                <Text className="text-gray-600">Khóa học đang học</Text>
              </View>
            </View>
            <View className="flex-1 px-2">
              <View className="bg-white p-4 rounded-xl">
                <View className="flex-row items-center">
                  <View className="mt-2 w-10 h-10 bg-purple-100 rounded-full items-center justify-center mb-2">
                    <MaterialIcons
                      name="trending-up"
                      size={24}
                      color="#9333EA"
                    />
                  </View>
                  <Text className="text-2xl font-bold ml-2">
                    {Math.round(
                      childCourse.data.reduce(
                        (sum, course) => sum + (course.completionRate || 0),
                        0
                      ) / (childCourse.data.length || 1)
                    )}{" "}
                    %
                  </Text>
                </View>

                <Text className="text-gray-600">Tiến độ trung bình</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Active Courses */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold">Khóa học đang học</Text>
            <Pressable
              className="flex-row items-center"
              onPress={() =>
                router.push("/purchased-courses/purchased-courses" as any)
              }
            >
              <MaterialIcons name="add" size={24} color="#3B82F6" />
              <Text className="text-blue-500 font-medium ml-1">
                Kích hoạt thêm
              </Text>
            </Pressable>
          </View>

          {childCourse.data.map((course) => (
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
                  pathname: "/learning-management/course-progress/[id]",
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
                  <Text className="font-bold" numberOfLines={2}>
                    {course.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MaterialIcons name="schedule" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">
                      {course.durationDisplay}
                    </Text>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <MaterialIcons name="bar-chart" size={16} color="#6B7280" />
                    {/* <Text className="text-gray-600 ml-1">{course.level}</Text> bug day ne*/}
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
                          {course.categories.slice(0, 3).map((category) => (
                            <View
                              key={category.id}
                              className="bg-orange-200 px-2 py-1 rounded-2xl ml-2"
                            >
                              <Text className="text-gray-500">
                                {category.name}
                              </Text>
                            </View>
                          ))}

                          {course.categories.length > 3 && (
                            <View className="bg-orange-200 px-2 py-1 rounded-2xl ml-2">
                              <Text className="text-gray-500">...</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {/* Progress */}
              <View className="mt-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600">Tiến độ học tập</Text>
                  <Text className="font-medium">
                    {course.completionRate || 0}%
                  </Text>
                  <Text className="font-medium"> 5 %</Text>
                </View>
                <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <View
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${course.completionRate || 0}%`,
                    }}
                  />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="p-4 border-t border-gray-100">
          <Pressable
            className="bg-blue-500 p-4 rounded-xl flex-row items-center justify-center mb-3"
            onPress={() =>
              router.push("/purchased-courses/purchased-courses" as any)
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
