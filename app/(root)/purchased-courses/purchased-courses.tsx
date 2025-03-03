import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import {
  MOCK_USER,
  MOCK_COURSES,
  MOCK_PURCHASED_COURSES,
} from "@/constants/mock-data";
import { useAppStore } from "@/components/app-provider";
import { useAssignCourse, useMyCourseStore } from "@/queries/useCourse";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { MyCourseType } from "@/model/course";
import { Childs } from "@/model/child";

export default function PurchasedCoursesScreen() {
  const [selectedCourse, setSelectedCourse] = useState<
    MyCourseType["data"]["details"][0] | null
  >(null);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const childs = useAppStore((state) => state.childs);
  const profile = useAppStore((state) => state.profile);
  const myCourses = useAppStore((state) => state.myCourses);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalItem = myCourses?.data ? myCourses?.data.totalItem : 0;
  const courses = myCourses?.data ? myCourses?.data.details : [];

  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
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
      console.log("Đang chạy cho con");
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
      console.log("Đang chạy cho cha");
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
      console.log(data);
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
        <HeaderWithBack
          title="Khóa học đã mua"
          showMoreOptions={true}
          returnTab={"/(tabs)/profile/profile"}
        />
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
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="Khóa học đã mua"
        returnTab={"/(tabs)/profile/profile"}
      />
      <ScrollView>
        {/* Stats */}
        <View className="flex-row p-4">
          <View className="flex-1 bg-blue-50 rounded-xl p-4 mr-2">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
              <MaterialIcons name="shopping-bag" size={24} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold">{totalItem}</Text>
            <Text className="text-gray-600">Đã mua</Text>
          </View>
          <View className="flex-1 bg-green-50 rounded-xl p-4 ml-2">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
              <MaterialIcons name="person-add" size={24} color="#059669" />
            </View>
            <Text className="text-2xl font-bold">
              {availableForActivation.length}
            </Text>
            <Text className="text-gray-600">Chờ kích hoạt</Text>
          </View>
        </View>

        {/* Course List */}
        <View className="p-4">
          {courses.map((course) => (
            <View
              key={course.course.id}
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
                source={{ uri: course.course.imageUrl }}
                className="w-full h-48 rounded-t-xl"
              />
              <View className="p-4">
                <Text className="font-bold text-lg mb-2">
                  {course.course.title}
                </Text>

                {/* Purchase Info */}
                <View className="flex-row items-center mb-3">
                  <MaterialIcons name="event" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    Xuất bản {course.course.createAtFormatted}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <MaterialCommunityIcons
                    name="medal-outline"
                    size={16}
                    color="#6B7280"
                  />
                  <Text className="text-gray-600 ml-1">
                    {course.course.level}
                  </Text>
                </View>

                {/* Course Info */}
                <View className="flex-row items-center mb-3">
                  <MaterialIcons name="schedule" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    {course.course.durationDisplay}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>

                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="tag-outline"
                      size={16}
                      color="#6B7280"
                    />
                    {!course.course.categories.length ? (
                      <View className="bg-orange-200 px-1 rounded-2xl ml-2">
                        <Text className="text-gray-500 px-1 py-1 rounded-md">
                          --
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap">
                        {course.course.categories
                          .slice(0, 3)
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

                        {course.course.categories.length > 3 && (
                          <View className="bg-orange-200 px-2 py-1 rounded-2xl ml-2">
                            <Text className="text-gray-500">...</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>

                {/* Activation Status */}
                <View className="bg-gray-50 p-3 rounded-lg mb-4">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Số lượng mua</Text>
                    <Text className="font-medium">
                      {course.course.price != 0
                        ? course.quantityAtPurchase
                        : "--"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Đã kích hoạt</Text>
                    <Text className="font-medium">
                      {course.assignedTo.length}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Còn lại</Text>
                    <Text className="font-medium text-blue-500">
                      {course.course.price != 0 ? course.unusedQuantity : "∞"}
                    </Text>
                  </View>
                </View>

                {/* Activated For */}
                {course.assignedTo.length > 0 && (
                  <View className="mb-4">
                    <Text className="font-medium mb-2">Đã kích hoạt cho:</Text>
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
                              className="flex-row items-center mr-4 mb-2"
                            >
                              <Image
                                source={{
                                  uri: account1.avatar,
                                }}
                                className="w-6 h-6 rounded-full"
                              />
                              <Text className="ml-2 text-gray-600">
                                {account1.name}
                              </Text>
                            </View>
                          )
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Activation Button - Always show but conditionally style and disable */}
                <Pressable
                  className={`p-4 rounded-xl flex-row items-center justify-center ${
                    course.unusedQuantity > 0 ? "bg-blue-500" : "bg-gray-300"
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
        <View className="flex-1 bg-black/50 justify-center">
          <View className="bg-white mx-4 rounded-2xl">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-bold">Chọn người học</Text>
            </View>
            {/* Kiểm tra nếu tất cả childs và main account đã được gán */}
            {selectedCourse &&
            selectedCourse.assignedTo.length === (childs?.length || 0) + 1 ? (
              <View className="p-4">
                <Text className="text-red-500 text-center font-medium">
                  Tất cả tài khoản đã được gán khóa học này!
                </Text>
              </View>
            ) : (
              <ScrollView className="max-h-[70vh]">
                {/* Main Account */}
                <Pressable
                  className="flex-row items-center p-4 border-b border-gray-100"
                  onPress={() => handleAssignToMain()}
                >
                  <Image
                    source={{ uri: profile?.data.avatarUrl }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="font-bold">
                      {profile?.data.lastName + " " + profile?.data.firstName}
                    </Text>
                    <Text className="text-gray-600">Tài khoản chính</Text>
                    <Text className="text-gray-600">
                      {new Date().getFullYear() -
                        new Date(
                          convertDateFormat(profile.data.dob)
                        ).getFullYear()}{" "}
                      tuổi
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
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
                        source={{ uri: account.userDetail.avatarUrl }}
                        className="w-12 h-12 rounded-full"
                      />
                      <View className="ml-3 flex-1">
                        <Text className="font-bold">
                          {account.userDetail.lastName +
                            " " +
                            account.userDetail.firstName}
                        </Text>
                        <Text className="text-gray-600">Tài khoản con</Text>
                        <Text className="text-gray-600">
                          {new Date().getFullYear() -
                            new Date(account.userDetail.dob).getFullYear()}{" "}
                          tuổi
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
            )}

            <View className="p-4 border-t border-gray-100">
              <Pressable
                className="p-4 bg-gray-100 rounded-xl items-center"
                onPress={() => setShowActivateModal(false)}
              >
                <Text className="font-medium text-gray-700">Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
