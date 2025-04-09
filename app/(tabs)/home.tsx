import React, { useCallback, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import {
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CartButton from "@/components/CartButton";
import { useCourses, useMyCourseStore } from "@/queries/useCourse";
import { useAppStore } from "@/components/app-provider";
import { courseRes, GetAllCourseResType } from "@/schema/course-schema";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import { useBlog } from "@/queries/useBlog";
import { blogRes, GetAllBlogResType } from "@/schema/blog-schema";
import { useShippingInfos } from "@/queries/useShippingInfos";
import { useCart } from "@/queries/useCart";
import { useMyChilds, useMyCourse, useUserProfile } from "@/queries/useUser";
import { myCourseRes } from "@/schema/user-schema";
import { GetMyCoursesResType } from "@/schema/user-schema";
import { useAllProduct } from "@/queries/useProduct";
import { productRes, GetAllProductResType } from "@/schema/product-schema";
import * as Device from "expo-device";

export default function HomeScreen() {
  // const getDeviceId = () => {
  //   return Device.osBuildId || Device.osInternalBuildId || "unknown";
  // };
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const profile = useAppStore((state) => state.profile);

  // Gọi API shipping
  const {
    data: shippingData, 
    isLoading: isLoadingShipping,   
    isError: isErrorShipping,
    refetch: refetchShipping,
  } = useShippingInfos({ token: token ? token : "", enabled: true });

  // Gọi API cart
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isErrorCart,
    refetch: refetchCart,
  } = useCart({ token: token ? token : "", enabled: true });

  const {
    data: childData,
    isLoading: isLoadingChild,
    isError: isErrorChild,
    refetch: refetchChild,
  } = useMyChilds({ token: token ? token : "", enabled: true });

  const {
    data: profileData,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useUserProfile({ token: token ? token : "", enabled: true });

  const {
    data: myCourseData,
    isLoading: isLoadingMyCourse,
    isError: isErrorMyCourse,
    refetch: refetchMyCourseStore,
  } = useMyCourseStore({ token: token ? token : "", enabled: true });

  useEffect(() => {
    refetchShipping();
    refetchChild();
    refetchProfile();
    refetchMyCourseStore();
  }, [token]);

  const {
    data: myCourseOverviewData,
    isLoading: myCourseOverviewLoading,
    isError: myCourseOverviewError,
    refetch: refetchMyCourse,
  } = useMyCourse({
    token: token as string,
  });

  const {
    data: productListData,
    isLoading: productListDataLoading,
    isError: productListDataError,
    refetch: refetchProductList,
  } = useAllProduct({
    token: token as string,
  });

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourseList,
  } = useCourses({
    keyword: "",
    page_size: 10,
    page_index: 1,
  });

  const {
    data: blogData,
    isLoading: blogLoading,
    isError: blogError,
    refetch: refetchBlogList,
  } = useBlog({
    keyword: "",
    page_size: 10,
    page_index: 1,
  });

  // Refetch data when focused
  useFocusEffect(() => {
    refetchCart();
    refetchMyCourse();
    refetchCourseList();
    refetchProductList();
    refetchBlogList();
  });

  let myCourse: GetMyCoursesResType["data"] = [];

  if (myCourseOverviewData && !myCourseOverviewError) {
    if (myCourseOverviewData.data.length === 0) {
    } else {
      const parsedResult = myCourseRes.safeParse(myCourseOverviewData);
      if (parsedResult.success) {
        myCourse = parsedResult.data.data;
      } else {
        console.error(
          "My course validation errors:",
          parsedResult.error.errors
        );
      }
    }
  }

  let courses: GetAllCourseResType["data"] = [];

  if (coursesData && !coursesError) {
    if (coursesData.data.length === 0) {
      console.log("No courses found in coursesData");
    } else {
      const parsedResult = courseRes.safeParse(coursesData);
      if (parsedResult.success) {
        courses = parsedResult.data.data;
      } else {
        console.error("Course validation errors:", parsedResult.error.errors);
      }
    }
  }

  let blog: GetAllBlogResType["data"] = [];

  if (blogData && !blogError) {
    if (blogData.data.length === 0) {
    } else {
      const parsedResult = blogRes.safeParse(blogData);
      if (parsedResult.success) {
        blog = parsedResult.data.data;
      } else {
        console.error("Blog validation errors:", parsedResult.error.errors);
      }
    }
  }

  let product: GetAllProductResType["data"] = [];

  if (productListData && !productListDataError) {
    if (productListData.data.length === 0) {
    } else {
      const parsedResult = productRes.safeParse(productListData);
      if (parsedResult.success) {
        product = parsedResult.data.data;
      } else {
        console.error("Product validation errors:", parsedResult.error.errors);
      }
    }
  }

  if (
    myCourseOverviewLoading ||
    coursesLoading ||
    blogLoading ||
    productListDataLoading
  )
    return <ActivityIndicatorScreen />;

  const featuredCourses = courses;
  const featuredProducts = product;
  const latestBlog = blog[0];

  // console.log('Fetched Data:', JSON.stringify(coursesData, null, 2))

  return (
    <ScrollView className="flex-1 pt-4 bg-white">
      <SafeAreaView>
        {/* Header with Avatar */}
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold">
              Xin chào, {profile?.data.firstName}!
            </Text>
            <Text className="text-gray-600 mt-1">Hôm nay bạn muốn học gì?</Text>
          </View>
          {/* Cart and Notifications */}
          <View className="flex-row items-center">
            <CartButton />
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-2"
              onPress={() => router.push("/(root)/notifications/notifications")}
            >
              <MaterialIcons name="notifications" size={24} color="#374151" />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <Pressable
          className="mx-4 mt-6 flex-row items-center bg-gray-100 rounded-xl p-3"
          onPress={() => router.push("/search/searchCourse")}
        >
          <MaterialIcons name="search" size={24} color="#6B7280" />
          <Text className="ml-2 text-gray-500 flex-1">
            Tìm kiếm khóa học...
          </Text>
        </Pressable>

        {/* Quick Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View className="flex-row justify-between px-4 mt-6">
            <View className="bg-blue-100 rounded-xl p-4 flex-1 mr-2">
              <View className="flex-row">
                <View className="bg-blue-500 w-8 h-8 rounded-lg items-center justify-center mb-2">
                  <MaterialIcons name="school" size={20} color="#fff" />
                </View>
                <Text className="font-bold text-lg pl-2">
                  {myCourse.length || 0}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Khóa học</Text>
            </View>

            <View className="bg-green-100 rounded-xl p-4 flex-1 mx-2">
              <View className="flex-row">
                <View className="bg-green-500 w-8 h-8 rounded-lg items-center justify-center mb-2">
                  <MaterialIcons
                    name="assignment-turned-in"
                    size={20}
                    color="#fff"
                  />
                </View>
                <Text className="font-bold text-lg ml-2">
                  {
                    myCourse.filter((course) => course.completionRate === 100)
                      .length || 0
                  }
                </Text>
              </View>

              <Text className="text-gray-600 text-sm">Hoàn thành</Text>
            </View>
            <View className="bg-purple-100 rounded-xl p-4 flex-1 ml-2">
              <View className="flex-row">
                <View className="bg-purple-500 w-8 h-8 rounded-lg items-center justify-center mb-2">
                  <MaterialIcons name="trending-up" size={20} color="#fff" />
                </View>
                <Text className="font-bold text-lg ml-2">
                  {Math.round(
                    myCourse.reduce(
                      (acc, course) => acc + course.completionRate,
                      0
                    ) / myCourse.length
                  ) || 0} 
                  %
                </Text>
              </View>

              <Text className="text-gray-600 text-sm">Tiến độ TB</Text>
            </View>
          </View>
        </ScrollView>

        {/* Latest Blog */}
        {latestBlog && (
          <View className="mt-6 pb-6">
            <Text className="text-lg font-bold px-4 mb-3">Bài viết mới</Text>
            <Pressable
              className="bg-white rounded-2xl overflow-hidden mx-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => router.push(`/blog/${latestBlog.id}` as any)}
            >
              <Image
                source={{ uri: latestBlog.imageUrl }}
                className="w-full h-48"
              />
              <View className="p-3">
                <View className="flex-row flex-wrap items-center">
                  {latestBlog.categories.slice(0, 2).map((category, index) => (
                    <React.Fragment key={category.id || index}>
                      <Text className="text-blue-600 text-xs font-semibold px-3 py-1.5 bg-blue-50 rounded-full">
                        {category.name}
                      </Text>
                      {index <
                        Math.min(latestBlog.categories.length - 1, 1) && (
                        <Text className="text-gray-300 mx-2">•</Text>
                      )}
                    </React.Fragment>
                  ))}
                  {latestBlog.categories.length > 2 && (
                    <>
                      <Text className="text-gray-300 mx-2">•</Text>
                      <Text className="text-blue-600 text-xs font-semibold px-3 py-1.5 bg-blue-50 rounded-full">
                        ...
                      </Text>
                    </>
                  )}
                </View>
                <Text className="text-lg font-bold mt-2">
                  {latestBlog.title}
                </Text>
                <Text className="text-gray-600 mt-1" numberOfLines={2}>
                  {latestBlog.description}
                </Text>

                <View className="flex-row items-center mt-3">
                  <MaterialIcons name="person" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">
                    {latestBlog.creatorInfo.firstName}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500">
                    {latestBlog.createdAtFormatted}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Featured Courses */}
        <View className="mt-6">
          <View className="px-4 flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">Khóa học nổi bật</Text>
            <Pressable
              onPress={() => router.push("/course/course")}
              disabled={
                !featuredCourses || featuredCourses.length == 0 ? true : false
              }
            >
              <Text className="text-blue-500">Xem tất cả</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4 pb-2"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {featuredCourses.map((course) => (
              <Pressable
                key={course.id}
                className="bg-white rounded-2xl mr-3 w-64 overflow-hidden"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={() =>
                  router.push({
                    pathname: "/courses/[id]",
                    params: { id: course.id },
                  })
                }
              >
                <Image
                  source={{
                    uri:
                      course.imageUrl ??
                      "https://thumbs.dreamstime.com/b/orange-cosmos-flower-bud-garden-indiana-39358565.jpg",
                  }}
                  className="w-full h-32"
                  style={{ resizeMode: "cover" }}
                />
                <View className="p-3">
                  <View className="flex-row flex-wrap gap-2">
                    {!course.categories.length ? (
                      <View className="bg-blue-50 px-3 py-1 rounded-full">
                        <Text className="text-blue-600 text-xs font-medium">
                          --
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap gap-1">
                        {course.categories.slice(0, 2).map((category) => (
                          <View
                            key={category.id}
                            className="bg-blue-50 px-3 py-1 rounded-full"
                          >
                            <Text className="text-blue-600 text-xs font-medium">
                              {category.name}
                            </Text>
                          </View>
                        ))}
                        {course.categories.length > 2 && (
                          <View className="bg-blue-50 px-3 py-1 rounded-full">
                            <Text className="text-blue-600 text-xs font-medium">
                              ...
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <Text className="font-bold text-lg" numberOfLines={2}>
                    {course.title.length > 22
                      ? course.title.substring(0, 22) + "..."
                      : course.title}
                  </Text>
                  <Text
                    className="text-gray-500 text-xs mt-1 mb-2"
                    numberOfLines={1}
                  >
                    {course.description.length > 50
                      ? course.description.substring(0, 50) + "..."
                      : course.description}
                  </Text>

                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center gap-2">
                      <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <MaterialIcons name="star" size={14} color="#F59E0B" />
                        <Text className="ml-1 text-sm font-medium text-yellow-600">
                          {course.aveRating == 0 ? 5 : course.aveRating}
                        </Text>
                      </View>
                      <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full">
                        <MaterialIcons
                          name="people"
                          size={14}
                          color="#8B5CF6"
                        />
                        <Text className="ml-1 text-sm font-medium text-purple-600">
                          {course.totalEnrollment}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`font-bold ${
                        course.price === 0 ? "text-green-500" : "text-blue-500"
                      }`}
                    >
                      {course.price !== 0
                        ? course.price.toLocaleString("vi-VN") + " ₫"
                        : "Miễn phí"}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <View className="pr-1 justify-between items-end mb-3">
            <Pressable
              onPress={() => router.push("/custom-course/custom-course")}
              disabled={
                !featuredCourses || featuredCourses.length == 0 ? true : false
              }
              className="bg-blue-500 rounded-xl"
            >
              <Text className="text-white p-2">+ Khóa học tùy chỉnh</Text>
            </Pressable>
          </View>
        </View>

        {/* Featured Product */}
        <View className="mt-6">
          <View className="px-4 flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">Sản phẩm nổi bật</Text>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/(root)/product/product",
                });
              }}
              disabled={
                !featuredProducts || featuredProducts.length == 0 ? true : false
              }
            >
              <Text className="text-blue-500">Xem tất cả</Text>
            </Pressable>
          </View>
          {featuredProducts && featuredProducts.length != 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pl-4 pb-2"
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {featuredProducts.map((product) => (
                <Pressable
                  key={product.id}
                  className="bg-white rounded-2xl mr-3 w-64 overflow-hidden"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  onPress={() => {
                    const productDetail = JSON.stringify(product);
                    router.push({
                      pathname: "/product/[id]",
                      params: { id: product.id, productDetail: productDetail },
                    });
                  }}
                >
                  <Image
                    source={{ uri: product.images[0].imageUrl }}
                    className="w-full h-32"
                    style={{ resizeMode: "cover" }}
                  />
                  <View className="p-3">
                    <View className="flex-row flex-wrap gap-2">
                      {!product.categories.length ? (
                        <View className="bg-blue-50 px-3 py-1 rounded-full">
                          <Text className="text-blue-600 text-xs font-medium">
                            --
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row flex-wrap gap-1">
                          {product.categories.slice(0, 2).map((category) => (
                            <View
                              key={category.id}
                              className="bg-blue-50 px-3 py-1 rounded-full"
                            >
                              <Text className="text-blue-600 text-xs font-medium">
                                {category.name}
                              </Text>
                            </View>
                          ))}
                          {product.categories.length > 2 && (
                            <View className="bg-blue-50 px-3 py-1 rounded-full">
                              <Text className="text-blue-600 text-xs font-medium">
                                ...
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                    <Text className="font-bold mt-2 text-lg" numberOfLines={2}>
                      {product.name.length > 25
                        ? product.name.substring(0, 25) + "..."
                        : product.name}
                    </Text>
                    <Text
                      className="text-gray-500 text-xs mt-1 mb-2"
                      numberOfLines={1}
                    >
                      {product.description.length > 50
                        ? product.description.substring(0, 50) + "..."
                        : product.description}
                    </Text>

                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <MaterialIcons
                            name="star"
                            size={14}
                            color="#F59E0B"
                          />
                          <Text className="ml-1 text-sm font-medium text-yellow-600">
                            {product.averageRating == 0
                              ? 5
                              : product.averageRating}
                          </Text>
                        </View>
                        {product && product.discount != 0 ? (
                          <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-full">
                            <Foundation
                              name="burst-sale"
                              size={14}
                              color="#8B5CF6"
                            />

                            <Text className="ml-1 text-sm font-medium text-purple-600">
                              {product.discount
                                ? `${product.discount * 100}%`
                                : "0%"}
                            </Text>
                          </View>
                        ) : (
                          <></>
                        )}
                      </View>
                      <Text
                        className={`font-bold ${
                          product.price === 0
                            ? "text-green-500"
                            : "text-blue-500"
                        }`}
                      >
                        {product.price !== 0
                          ? product.price.toLocaleString("vi-VN") + " ₫"
                          : "Miễn phí"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <></>
          )}
        </View>
        <View className="h-20"></View>
      </SafeAreaView>
    </ScrollView>
  );
}
