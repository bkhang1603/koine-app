import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useAssignCourse, useMyCourseStore } from "@/queries/useCourse";
import { MyCourseType } from "@/model/course";
import { Childs } from "@/model/child";
import { useFocusEffect } from "@react-navigation/native";
import formatDuration from "@/util/formatDuration";

// Menu options array for more menu
const MENU_OPTIONS = [
  {
    id: 1,
    title: "Khóa học của tôi",
    icon: "book",
    route: "/(tabs)/my-courses/my-courses",
  },
  {
    id: 2,
    title: "Tài khoản con",
    icon: "people",
    route: "/(root)/sub-accounts/sub-accounts",
  },
  {
    id: 3,
    title: "Thành tựu",
    icon: "emoji-events",
    route: "/(root)/achievements/achievements",
  },
  {
    id: 4,
    title: "Cài đặt",
    icon: "settings",
    route: "/(tabs)/profile/account-settings",
  },
];

export default function PurchasedCoursesScreen() {
  const [selectedCourse, setSelectedCourse] = useState<
    MyCourseType["data"]["details"][0] | null
  >(null);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const childs = useAppStore((state) => state.childs);
  const profile = useAppStore((state) => state.profile);
  const myCourses = useAppStore((state) => state.myCourses);
  const [isProcessing, setIsProcessing] = useState(false);

  const notificationBadge = useAppStore((state) => state.notificationBadge);
  const totalItem = myCourses?.data ? myCourses?.data.totalItem : 0;
  const courses = myCourses?.data ? myCourses?.data.details : [];

  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const firstName = profile?.data.firstName || "";
  const firstName_Initial = firstName ? firstName.charAt(0).toUpperCase() : "";

  const {
    data: myCourseData,
    isLoading: isLoadingMyCourse,
    isError: isErrorMyCourse,
    refetch: refetchMyCourseStore,
  } = useMyCourseStore({
    token: token ? token : "",
    enabled: true,
    page_index: 1,
    page_size: 100,
  });
  useFocusEffect(() => {
    refetchMyCourseStore();
  });
  const assignCourse = useAssignCourse();

  // Lọc ra các khóa học còn slot để kích hoạt
  const availableForActivation = courses.filter(
    (course) => course.unusedQuantity > 0
  );

  const handleActivate = (course: MyCourseType["data"]["details"][0]) => {
    setSelectedCourse(course);
    setShowActivateModal(true);
  };

  const convertDateFormat = (dob: string): string => {
    // Tách ngày, tháng, năm từ chuỗi "dd/mm/yyyy"
    const [day, month, year] = dob.split("/").map((part) => parseInt(part, 10));

    // Tạo đối tượng Date (Lưu ý: Tháng trong JavaScript bắt đầu từ 0)
    const date = new Date(year, month - 1, day);

    // Chuyển thành định dạng yyyy-mm-dd
    const formattedDate = date.toISOString().split("T")[0];

    return formattedDate;
  };

  const handleAssignToChild = async (chosenChild: Childs[0]) => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      if (!chosenChild) {
        Alert.alert("Lỗi", "Chọn một tài khoản con để gán!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
        return;
      }

      if (!selectedCourse) {
        Alert.alert("Lỗi", "Chọn một khóa học để gán!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
        return;
      }
      //call api ở đây để đăng kí nếu thành công thì đẩy qua
      const dataBody = {
        childId: chosenChild.id,
        courseId: selectedCourse.course.id,
      };
      const res = await assignCourse.mutateAsync({
        body: dataBody,
        token: token,
      });
      if (res) {
        setIsProcessing(false);
        setShowActivateModal(false);
        router.push({
          pathname: "/sub-accounts/[id]",
          params: {
            id: chosenChild.id,
          },
        });
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Lỗi", `${error}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
    }
  };

  const handleAssignToMain = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);

      if (!selectedCourse) {
        Alert.alert("Lỗi", "Chọn một khóa học để gán!", [
          {
            text: "tắt",
            style: "cancel",
          },
        ]);
        setIsProcessing(false);
        return;
      }
      //call api ở đây để đăng kí nếu thành công thì đẩy qua
      const data = {
        childId: null,
        courseId: selectedCourse.course.id,
      };
      const res = await assignCourse.mutateAsync({
        body: data,
        token: token,
      });
      if (res) {
        setShowActivateModal(false);
        router.push("/(tabs)/my-courses/my-courses");
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Lỗi", `${error}`, [
        {
          text: "tắt",
          style: "cancel",
        },
      ]);
    }
  };

  if (totalItem == 0 || !profile) {
    return (
      <View className="flex-1 bg-white">
        <ExpoStatusBar style="light" />
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
                Khóa học đã mua
              </Text>
            </View>

            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 mr-1 rounded-full bg-white/20 items-center justify-center"
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
                className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                onPress={() => setShowMenu(true)}
              >
                <MaterialIcons name="more-vert" size={22} color="white" />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
        <View className="flex-1 items-center justify-center p-4">
          <MaterialIcons name="school" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            Kho của bạn đang trống
          </Text>
          <Pressable
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white font-bold">Mua khóa học</Text>
          </Pressable>
        </View>

        {/* More Options Menu Modal */}
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
                    router.push(option.route as any);
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

  return (
    <View className="flex-1 bg-[#f5f7f9]">
      <ExpoStatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section - Modern Gradient matching other screens */}
        <LinearGradient
          colors={["#3b82f6", "#1d4ed8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pt-14 pb-8 px-5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.push("/(tabs)/profile/profile")}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
              >
                <MaterialIcons name="arrow-back" size={22} color="white" />
              </Pressable>
              <View>
                <Text className="text-white/80 text-sm font-medium">
                  Quản lý
                </Text>
                <Text className="text-white text-lg font-bold">
                  Khóa học đã mua
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Pressable
                className="w-10 h-10 mr-1 rounded-full bg-white/20 items-center justify-center"
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
                className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                onPress={() => setShowMenu(true)}
              >
                <MaterialIcons name="more-vert" size={22} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Stats Summary in Header */}
          <View className="flex-row mt-2">
            <View className="flex-1 bg-white/10 rounded-xl p-3 mr-2">
              <Text className="text-white text-xl font-bold">{totalItem}</Text>
              <Text className="text-white/80 text-sm">Đã mua</Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-xl p-3 ml-2">
              <Text className="text-white text-xl font-bold">
                {availableForActivation.length}
              </Text>
              <Text className="text-white/80 text-sm">Chờ kích hoạt</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Course List - Modern design */}
        <View className="px-4 py-5">
          <Text className="text-lg font-bold mb-4">Danh sách khóa học</Text>
          {courses.map((course) => (
            <View
              key={course.course.id}
              className="bg-white rounded-xl mb-5 overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="relative">
                <Image
                  source={{ uri: course.course.imageUrl }}
                  className="w-full h-48"
                  style={{ resizeMode: "cover" }}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.4)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                  }}
                />
                <View className="absolute top-3 left-3 bg-blue-500/80 backdrop-blur-sm rounded-lg px-2.5 py-1">
                  <Text className="text-white text-xs font-medium">
                    {course.course.level == null
                      ? "Tất cả"
                      : course.course.level == "ALL"
                      ? "Tất cả"
                      : course.course.level == "BEGINNER"
                      ? "Khởi đầu"
                      : course.course.level == "INTERMEDIATE"
                      ? "Trung cấp"
                      : "Nâng cao"}
                  </Text>
                </View>
              </View>

              <View className="p-4">
                <Text className="font-bold text-lg mb-3">
                  {course.course.title}
                </Text>

                {/* Course Info */}
                <View className="flex-row items-center mb-4 flex-wrap">
                  <View className="flex-row items-center mr-4 mb-2">
                    <MaterialIcons name="event" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">
                      {course.course.createAtFormatted}
                    </Text>
                  </View>

                  <View className="flex-row items-center mr-4 mb-2">
                    <MaterialIcons name="schedule" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">
                      {formatDuration(course.course.durationDisplay)}
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap">
                    {course.course.categories.slice(0, 2).map((category) => (
                      <View
                        key={category.id}
                        className="bg-orange-100 px-2 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-orange-700 text-xs">
                          {category.name}
                        </Text>
                      </View>
                    ))}
                    {course.course.categories.length > 2 && (
                      <View className="bg-orange-100 px-2 py-1 rounded-full mr-2 mb-2">
                        <Text className="text-orange-700 text-xs">...</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Activation Status */}
                <View className="bg-gray-50 p-4 rounded-xl mb-4">
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-600">Số lượng mua</Text>
                    <Text className="font-semibold">
                      {course.course.price != 0
                        ? course.quantityAtPurchase
                        : "--"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-600">Đã kích hoạt</Text>
                    <Text className="font-semibold">
                      {course.assignedTo.length}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Còn lại</Text>
                    <Text className="font-semibold text-blue-500">
                      {course.course.price != 0 ? course.unusedQuantity : "∞"}
                    </Text>
                  </View>
                </View>

                {/* Activated For */}
                {course.assignedTo.length > 0 && (
                  <View className="mb-4">
                    <Text className="font-semibold mb-3">
                      Đã kích hoạt cho:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {course.assignedTo.map((account) => {
                        const account1 = {
                          name: account.name,
                          avatar: account.imageUrl,
                        };

                        return (
                          account1 && (
                            <View
                              key={account.id}
                              className="flex-row items-center bg-gray-50 px-2 py-1 rounded-full mr-3 mb-2"
                            >
                              <Image
                                source={{
                                  uri: account1.avatar,
                                }}
                                className="w-6 h-6 rounded-full"
                              />
                              <Text className="ml-2 text-gray-700">
                                {account1.name}
                              </Text>
                            </View>
                          )
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Activation Button */}
                <Pressable
                  className={`py-3.5 rounded-xl flex-row items-center justify-center mt-1 ${
                    course.unusedQuantity > 0
                      ? "bg-blue-500"
                      : "bg-red-300"
                  }`}
                  onPress={() =>
                    course.unusedQuantity > 0 && handleActivate(course)
                  }
                  disabled={course.unusedQuantity === 0}
                >
                  <MaterialIcons name="person-add" size={20} color="#fff" />
                  <Text className="text-white font-bold ml-2">
                    Kích hoạt khóa học
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Activation Modal */}
      <Modal
        visible={showActivateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActivateModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center">
          <View
            className="bg-white mx-4 rounded-3xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <LinearGradient
              colors={["#3b82f6", "#1d4ed8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-5 border-b border-gray-100"
            >
              <Text className="text-lg font-bold text-white">
                Chọn người học
              </Text>
              <Text className="text-white/80 text-sm mt-1">
                Chọn tài khoản để kích hoạt khóa học
              </Text>
            </LinearGradient>

            {/* Kiểm tra nếu tất cả childs và main account đã được gán */}
            {selectedCourse &&
            selectedCourse.assignedTo.length === (childs?.length || 0) + 1 ? (
              <View className="p-6">
                <View className="bg-red-50 p-4 rounded-xl">
                  <Text className="text-red-500 text-center font-medium">
                    Tất cả tài khoản đã được gán khóa học này!
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView className="max-h-[60vh]">
                {/* Main Account */}
                <Pressable
                  className="flex-row items-center p-4 border-b border-gray-100"
                  onPress={() => handleAssignToMain()}
                >
                  <Image
                    source={{
                      uri: profile?.data.avatarUrl,
                    }}
                    className="w-14 h-14 rounded-full border-2 border-blue-100"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-gray-800">
                      {profile?.data.lastName + " " + profile?.data.firstName}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-blue-100 rounded-full px-2 py-0.5 mr-2">
                        <Text className="text-blue-500 text-xs">
                          Tài khoản chính
                        </Text>
                      </View>
                      <Text className="text-gray-500 text-sm">
                        {new Date().getFullYear() -
                          new Date(
                            convertDateFormat(profile.data.dob)
                          ).getFullYear()}{" "}
                        tuổi
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={18}
                    color="#9CA3AF"
                  />
                </Pressable>

                {/* Sub Accounts */}
                {childs
                  ?.filter(
                    (account) =>
                      !selectedCourse?.assignedTo.some(
                        (assign) => assign.id === account.id
                      )
                  )
                  .map((account) => (
                    <Pressable
                      key={account.id}
                      className="flex-row items-center p-4 border-b border-gray-100"
                      onPress={() => {
                        handleAssignToChild(account);
                      }}
                    >
                      <Image
                        source={{
                          uri: account.userDetail.avatarUrl,
                        }}
                        className="w-14 h-14 rounded-full border-2 border-purple-100"
                      />
                      <View className="ml-3 flex-1">
                        <Text className="font-bold text-gray-800">
                          {account.userDetail.lastName +
                            " " +
                            account.userDetail.firstName}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <View className="bg-purple-100 rounded-full px-2 py-0.5 mr-2">
                            <Text className="text-purple-500 text-xs">
                              Tài khoản con
                            </Text>
                          </View>
                          <Text className="text-gray-500 text-sm">
                            {new Date().getFullYear() -
                              new Date(
                                account.userDetail.dob
                              ).getFullYear()}{" "}
                            tuổi
                          </Text>
                        </View>
                      </View>
                      <MaterialIcons
                        name="arrow-forward-ios"
                        size={18}
                        color="#9CA3AF"
                      />
                    </Pressable>
                  ))}
              </ScrollView>
            )}

            <View className="p-4">
              <Pressable
                className="p-3.5 bg-gray-100 rounded-xl items-center"
                onPress={() => setShowActivateModal(false)}
              >
                <Text className="font-medium text-gray-700">Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* More Options Menu Modal */}
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
                  router.push(option.route as any);
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
