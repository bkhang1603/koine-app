import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppStore } from "@/components/app-provider";
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
    title: "Quản lý học tập của các con",
    description: "Theo dõi tiến độ",
    icon: "insights",
    color: "purple",
    route: "/learning-management/learning-management",
  },
];

export default function SubAccountsScreen() {
  const profile = useAppStore((state) => state.profile);
  const childs = useAppStore((state) => state.childs);
  const myCourse = useAppStore((state) => state.myCourses);
  const [showMenu, setShowMenu] = useState(false);
  const notificationBadge = useAppStore((state) => state.notificationBadge);

  if (!childs || childs.length == 0) {
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
                onPress={() => router.push("/(tabs)/profile/profile")}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <MaterialIcons name="arrow-back" size={22} color="white" />
              </Pressable>
              <Text className="text-white text-lg font-bold ml-4">
                Quản lý tài khoản con
              </Text>
            </View>

            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                onPress={() =>
                  router.push("/(root)/notifications/notifications")
                }
              >
                <MaterialIcons name="notifications" size={26} color="white" />
                {/* Rating Badge */}
                {notificationBadge && notificationBadge != 0 ? (
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {notificationBadge > 9 ? "9+" : notificationBadge}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </Pressable>

              <Pressable
                className="ml-1 w-10 h-10 items-center justify-center rounded-full bg-white/20"
                onPress={() => setShowMenu(true)}
              >
                <MaterialIcons name="more-vert" size={22} color="white" />
              </Pressable>
            </View>  
          </View>
        </LinearGradient>

        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="people" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Bạn chưa đăng kí tài khoản con nào!
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(root)/sub-accounts/create")}
          >
            <Text className="text-white font-bold">Đăng kí ngay</Text>
          </Pressable>
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
                  <Text className="ml-3 text-gray-700">{option.title}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  const totalDetails = myCourse?.data.details.length ?? 0;
  const emptyAssignedCount =
    myCourse?.data.details.filter((item) => item.assignedTo.length === 0)
      .length ?? 0;
  const totalDifferentAssigned =
    myCourse?.data.details?.reduce(
      (sum, item) =>
        sum + item.assignedTo.filter((a) => a.id !== profile?.data.id).length,
      0
    ) ?? 0;

  const STATS = [
    {
      id: "total",
      label: "Tổng tài khoản con",
      value: childs?.length,
      icon: "people",
      color: "blue",
    },
    {
      id: "active",
      label: "Tổng loại khóa học",
      value: totalDetails || 0,
      icon: "school",
      color: "green",
    },
    {
      id: "available",
      label: "Khóa học đang chờ",
      value: emptyAssignedCount || 0,
      icon: "pending-actions",
      color: "yellow",
    },
  ];
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
              onPress={() => router.push("/(tabs)/profile/profile")}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={22} color="white" />
            </Pressable>
            <Text className="text-white text-lg font-bold ml-4">
              Quản lý tài khoản con
            </Text>
          </View>

          <View className="flex-row items-center">
            <Pressable
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => router.push("/(root)/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={26} color="white" />
              {/* Rating Badge */}
              {notificationBadge && notificationBadge != 0 ? (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {notificationBadge > 9 ? "9+" : notificationBadge}
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </Pressable>

            <Pressable
              className="ml-1 w-10 h-10 items-center justify-center rounded-full bg-white/20"
              onPress={() => setShowMenu(true)}
            >
              <MaterialIcons name="more-vert" size={22} color="white" />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="p-4"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {STATS.map((stat) => (
            <View
              key={stat.id}
              className={`bg-${stat.color}-500 rounded-xl p-4 mr-3 shadow-sm`}
              style={{ minWidth: 150 }}
            >
              <View className="flex-row">
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
                <Text className="text-2xl font-bold ml-3 text-white">
                  {stat.value}
                </Text>
              </View>

              <Text className="text-gray-200">{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View className="p-4 rounded-xl mx-4 bg-white shadow-sm mb-4">
          <Text className="text-lg font-bold mb-3">Thao tác nhanh</Text>
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
        <View className="p-4 mx-4 bg-white rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-2">
                <MaterialIcons name="people" size={18} color="#3B82F6" />
              </View>
              <Text className="text-lg font-bold">
                Tài khoản con({childs.length})
              </Text>
            </View>
            <Pressable
              className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-lg"
              onPress={() => router.push("/sub-accounts/create" as any)}
            >
              <MaterialIcons name="add" size={20} color="#3B82F6" />
              <Text className="text-blue-500 font-medium ml-1">Thêm mới</Text>
            </Pressable>
          </View>

          {childs.map((account) => {
            const activeCourses =
              myCourse?.data.details.filter((course) =>
                course.assignedTo.some((assigned) => assigned.id === account.id)
              ) ?? [];

            const totalProgress =
              activeCourses.length > 0
                ? Math.round(
                    activeCourses.reduce((sum, course) => {
                      const assignedToThis = course.assignedTo.find(
                        (a) => a.id === account.id
                      );
                      return (
                        sum +
                        (assignedToThis && "completionRate" in assignedToThis
                          ? (assignedToThis.completionRate as number)
                          : 0)
                      );
                    }, 0) / activeCourses.length
                  )
                : 0;

            return (
              <Pressable
                key={account.id}
                className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden"
                onPress={() =>
                  router.push({
                    pathname: "/sub-accounts/[id]",
                    params: { id: account.id },
                  })
                }
              >
                <View className="flex-row items-center p-4">
                  <View className="relative">
                    <Image
                      source={{
                        uri: account.userDetail.avatarUrl,
                      }}
                      className="w-16 h-16 rounded-full"
                    />
                    <View
                      className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                        activeCourses.length > 0
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                  </View>

                  <View className="ml-4 flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text
                        numberOfLines={1}
                        className="max-w-[120px] font-bold text-base text-gray-800"
                      >
                        {account.userDetail.firstName}
                      </Text>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          activeCourses.length > 0
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            activeCourses.length > 0
                              ? "text-green-700"
                              : "text-gray-600"
                          }`}
                        >
                          {activeCourses.length > 0
                            ? `${activeCourses.length} khóa học`
                            : "Chưa học"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center mt-1">
                      <MaterialIcons name="cake" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {new Date().getFullYear() -
                          new Date(account.userDetail.dob).getFullYear()}{" "}
                        tuổi
                      </Text>
                      <Text className="text-gray-400 mx-2">•</Text>
                      <MaterialIcons
                        name={
                          account.userDetail.gender === "MALE"
                            ? "male"
                            : "female"
                        }
                        size={14}
                        color={
                          account.userDetail.gender === "MALE"
                            ? "#3B82F6"
                            : "#EC4899"
                        }
                      />
                      <Text
                        className={`text-sm ml-1 ${
                          account.userDetail.gender === "MALE"
                            ? "text-blue-600"
                            : "text-pink-600"
                        }`}
                      >
                        {account.userDetail.gender === "MALE" ? "Nam" : "Nữ"}
                      </Text>
                    </View>
                  </View>
                </View>

                {activeCourses.length > 0 && (
                  <View className="px-4 pb-4 -mt-1">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-xs text-gray-500">
                        Tiến độ học tập
                      </Text>
                      <Text className="text-xs font-medium text-gray-700">
                        {totalProgress}%
                      </Text>
                    </View>
                    <View className="bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <View
                        className={`h-full rounded-full ${
                          totalProgress > 75
                            ? "bg-green-500"
                            : totalProgress > 40
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{
                          width: `${totalProgress}%`,
                        }}
                      />
                    </View>
                  </View>
                )}

                <View className="flex-row border-t border-gray-100 divide-x divide-gray-100">
                  <Pressable
                    className="flex-1 py-2.5 flex-row items-center justify-center"
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push({
                        pathname: "/sub-accounts/edit/[id]",
                        params: { id: account.id },
                      });
                    }}
                  >
                    <MaterialIcons name="edit" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1.5">
                      Chỉnh sửa
                    </Text>
                  </Pressable>

                  <Pressable
                    className="flex-1 py-2.5 flex-row items-center justify-center"
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push("/purchased-courses/purchased-courses");
                    }}
                  >
                    <MaterialIcons name="school" size={16} color="#3B82F6" />
                    <Text className="text-blue-500 text-sm ml-1.5">
                      Gán khóa học
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}

          {/* Learning Stats */}
          <View className="bg-blue-400 mt-2 py-4 px-4 rounded-xl">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <MaterialIcons name="auto-stories" size={20} color="white" />
              </View>
              <View className="ml-3">
              <Text className="text-white font-bold text-2xl ml-2">
                  {totalDifferentAssigned}
                </Text>
                <Text className="text-black text-sm">
                  Tổng loại khóa học đã gán
                </Text>
                
              </View>
            </View>
          </View>
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
                <Text className="ml-3 text-gray-700">{option.title}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
