import React, { useCallback, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    Pressable,
    ImageBackground,
} from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import {
    Foundation,
    MaterialCommunityIcons,
    MaterialIcons,
    Ionicons,
    FontAwesome5,
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
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

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
        page_size: 100,
        page_index: 1,
    });

    const {
        data: blogData,
        isLoading: blogLoading,
        isError: blogError,
        refetch: refetchBlogList,
    } = useBlog({
        keyword: "",
        page_size: 100,
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
                console.error(
                    "Course validation errors:",
                    parsedResult.error.errors
                );
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
                console.error(
                    "Blog validation errors:",
                    parsedResult.error.errors
                );
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
                console.error(
                    "Product validation errors:",
                    parsedResult.error.errors
                );
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
    const firstName = profile?.data.firstName || "Bạn";
    const firstName_Initial = firstName
        ? firstName.charAt(0).toUpperCase()
        : "K";

    return (
        <View className="flex-1 bg-[#f5f7f9]">
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section - Modern Gradient */}
                <LinearGradient
                    colors={["#3b82f6", "#1d4ed8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="pt-14 pb-14 px-5"
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
                                <Text className="text-white text-lg font-bold">
                                    {firstName_Initial}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-white/80 text-sm font-medium">
                                    Xin chào,
                                </Text>
                                <Text className="text-white text-lg font-bold">
                                    {firstName}!
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row">
                            <View className="mr-2">
                                <CartButton
                                    bgColor="bg-white/20"
                                    iconColor="white"
                                />
                            </View>
                            <Pressable
                                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                                onPress={() =>
                                    router.push(
                                        "/(root)/notifications/notifications"
                                    )
                                }
                            >
                                <MaterialIcons
                                    name="notifications-none"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    </View>

                    {/* <Pressable
                        className="flex-row items-center bg-white/20 rounded-xl p-3.5 mt-2"
                        onPress={() => router.push("/search/searchCourse")}
                    >
                        <MaterialIcons name="search" size={20} color="white" />
                        <Text className="ml-2 text-white/80 flex-1">
                            Tìm kiếm khóa học...
                        </Text>
                    </Pressable> */}
                </LinearGradient>

                {/* Stats Cards - Modern Elevated Card Style */}
                <View className="mx-5 -mt-8">
                    <View className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <View className="flex-row">
                            <View className="flex-1 p-4 border-r border-gray-100">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                                        <MaterialIcons
                                            name="school"
                                            size={18}
                                            color="#3b82f6"
                                        />
                                    </View>
                                    <Text className="text-gray-500 text-sm font-medium">
                                        Khóa học
                                    </Text>
                                </View>
                                <Text className="text-2xl font-bold text-gray-800">
                                    {myCourse.length || 0}
                                </Text>
                            </View>

                            <View className="flex-1 p-4">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2">
                                        <MaterialIcons
                                            name="trending-up"
                                            size={18}
                                            color="#10b981"
                                        />
                                    </View>
                                    <Text className="text-gray-500 text-sm font-medium">
                                        Tiến độ
                                    </Text>
                                </View>
                                <Text className="text-2xl font-bold text-gray-800">
                                    {Math.round(
                                        myCourse.reduce(
                                            (acc, course) =>
                                                acc + course.completionRate,
                                            0
                                        ) / (myCourse.length || 1)
                                    ) || 0}
                                    %
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Custom Course Creation Card - Premium Design */}
                <View className="mx-5 mt-6">
                    <LinearGradient
                        colors={["#6366f1", "#4f46e5"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-2xl shadow-lg overflow-hidden"
                    >
                        <Pressable
                            className="p-6"
                            onPress={() =>
                                router.push("/custom-course/custom-course")
                            }
                        >
                            <View className="relative">
                                {/* Decorative circles */}
                                <View className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/10" />
                                <View className="absolute -top-14 -right-4 w-16 h-16 rounded-full bg-white/5" />

                                {/* Icon in top corner */}
                                <View className="absolute -top-1 -right-1 w-14 h-14 rounded-full bg-indigo-400/30 items-center justify-center">
                                    <MaterialIcons
                                        name="edit"
                                        size={24}
                                        color="white"
                                    />
                                </View>

                                <View className="pr-10">
                                    <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-3">
                                        <Text className="text-white text-xs font-semibold">
                                            Ưu việt
                                        </Text>
                                    </View>
                                    <Text className="text-white text-xl font-bold mb-2">
                                        Tạo khóa học cá nhân hóa
                                    </Text>
                                    <Text className="text-white/80 text-sm mb-4 leading-5">
                                        Thiết kế khóa học theo nhu cầu riêng và
                                        mục tiêu học tập của bạn
                                    </Text>
                                    <View className="bg-white/30 self-start px-4 py-2 rounded-full flex-row items-center">
                                        <Text className="text-white font-semibold mr-1">
                                            Bắt đầu ngay
                                        </Text>
                                        <MaterialIcons
                                            name="arrow-forward"
                                            size={16}
                                            color="white"
                                        />
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    </LinearGradient>
                </View>

                {/* Featured Courses Section - Modern Card Design */}
                <View className="mt-8">
                    <View className="px-5 flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-gray-800">
                            Khóa học nổi bật
                        </Text>
                        <Pressable
                            onPress={() => router.push("/course/course")}
                            disabled={
                                !featuredCourses || featuredCourses.length === 0
                            }
                        >
                            <Text className="text-blue-600 font-medium">
                                Xem tất cả
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pl-5"
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {featuredCourses.map((course) => (
                            <Pressable
                                key={course.id}
                                className="bg-white rounded-2xl mr-4 w-[280px] shadow-md overflow-hidden"
                                onPress={() =>
                                    router.push({
                                        pathname: "/courses/[id]",
                                        params: { id: course.id },
                                    })
                                }
                            >
                                <View>
                                    <ImageBackground
                                        source={{
                                            uri:
                                                course.imageUrl ||
                                                "https://thumbs.dreamstime.com/b/orange-cosmos-flower-bud-garden-indiana-39358565.jpg",
                                        }}
                                        className="w-full h-40"
                                        imageStyle={{ resizeMode: "cover" }}
                                    >
                                        <LinearGradient
                                            colors={[
                                                "rgba(0,0,0,0)",
                                                "rgba(0,0,0,0.7)",
                                            ]}
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                height: 80,
                                            }}
                                        />

                                        {/* Category Badge */}
                                        {course.categories.length > 0 && (
                                            <View className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 shadow-sm">
                                                <Text className="text-blue-700 text-xs font-medium">
                                                    {course.categories[0].name}
                                                </Text>
                                            </View>
                                        )}

                                        {/* Rating Badge */}
                                        <View className="absolute bottom-3 left-3 flex-row items-center bg-black/40 rounded-full px-2 py-1">
                                            <MaterialIcons
                                                name="star"
                                                size={14}
                                                color="#FBBF24"
                                            />
                                            <Text className="ml-1 text-white text-xs font-medium">
                                                {course.aveRating === 0
                                                    ? 5
                                                    : course.aveRating}
                                            </Text>
                                        </View>

                                        <View className="absolute bottom-3 right-16 flex-row items-center bg-black/40 rounded-full px-2 py-1">
                                            <MaterialIcons
                                                name="signal-cellular-alt"
                                                size={14}
                                                color="white"
                                            />
                                            <Text className="ml-1 text-white text-xs font-medium">
                                                {course.ageStage || "18+"} tuổi
                                            </Text>
                                        </View>

                                        {/* Enrollment Badge */}
                                        <View className="absolute bottom-3 right-3 flex-row items-center bg-black/40 rounded-full px-2 py-1">
                                            <MaterialIcons
                                                name="people"
                                                size={14}
                                                color="white"
                                            />
                                            <Text className="ml-1 text-white text-xs font-medium">
                                                {course.totalEnrollment}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                </View>

                                <View className="p-4">
                                    <Text
                                        className="font-bold text-gray-800 text-base"
                                        numberOfLines={1}
                                    >
                                        {course.title}
                                    </Text>

                                    <Text
                                        className="text-gray-500 text-xs mt-2 mb-3"
                                        numberOfLines={2}
                                    >
                                        {course.description}
                                    </Text>

                                    <View className="mt-2 flex-row items-center justify-between">
                                        <View className="flex-row items-center space-x-1">
                                            <View className="w-6 h-6 rounded-full bg-blue-50 items-center justify-center">
                                                <MaterialIcons
                                                    name="play-circle-outline"
                                                    size={16}
                                                    color="#3b82f6"
                                                />
                                            </View>
                                            <Text className="text-gray-600 text-xs">
                                                Nhiều bài học
                                            </Text>
                                        </View>
                                        <Text
                                            className={`font-bold text-lg ${
                                                course.price === 0
                                                    ? "text-green-600"
                                                    : "text-blue-600"
                                            }`}
                                        >
                                            {course.price !== 0
                                                ? course.price.toLocaleString(
                                                      "vi-VN"
                                                  ) + "₫"
                                                : "Miễn phí"}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Latest Blog Section - Modern Card Design */}
                {latestBlog && (
                    <View className="mt-8 px-5">
                        <Text className="text-xl font-bold text-gray-800 mb-4">
                            Bài viết mới nhất
                        </Text>

                        <Pressable
                            className="bg-white rounded-2xl shadow-md overflow-hidden"
                            onPress={() =>
                                router.push(`/blog/${latestBlog.id}` as any)
                            }
                        >
                            <ImageBackground
                                source={{ uri: latestBlog.imageUrl }}
                                className="w-full h-48"
                                imageStyle={{ resizeMode: "cover" }}
                            >
                                <LinearGradient
                                    colors={[
                                        "rgba(0,0,0,0)",
                                        "rgba(0,0,0,0.8)",
                                    ]}
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        height: 100,
                                    }}
                                />
                                <View className="absolute bottom-0 left-0 right-0 p-4">
                                    <View className="flex-row mb-2">
                                        {latestBlog.categories
                                            .slice(0, 1)
                                            .map((category, index) => (
                                                <View
                                                    key={category.id || index}
                                                    className="bg-white/20 px-3 py-1 rounded-full mr-2"
                                                >
                                                    <Text className="text-white text-xs font-medium">
                                                        {category.name}
                                                    </Text>
                                                </View>
                                            ))}
                                    </View>
                                    <Text
                                        className="text-white text-xl font-bold"
                                        numberOfLines={2}
                                    >
                                        {latestBlog.title}
                                    </Text>
                                </View>
                            </ImageBackground>

                            <View className="p-4">
                                <Text
                                    className="text-gray-600 mb-4"
                                    numberOfLines={2}
                                >
                                    {latestBlog.description}
                                </Text>

                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center">
                                            <Text className="text-gray-600 text-xs font-bold">
                                                {latestBlog.creatorInfo.firstName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text className="text-gray-600 text-sm ml-2">
                                            {latestBlog.creatorInfo.firstName}
                                        </Text>
                                    </View>
                                    <Text className="text-gray-500 text-xs">
                                        {latestBlog.createdAtFormatted}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                )}

                {/* Featured Products Section - Modern Card Design */}
                <View className="mt-8 mb-10">
                    <View className="px-5 flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-gray-800">
                            Sản phẩm nổi bật
                        </Text>
                        <Pressable
                            onPress={() =>
                                router.push("/(root)/product/product")
                            }
                            disabled={
                                !featuredProducts ||
                                featuredProducts.length === 0
                            }
                        >
                            <Text className="text-blue-600 font-medium">
                                Xem tất cả
                            </Text>
                        </Pressable>
                    </View>

                    {featuredProducts && featuredProducts.length > 0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="pl-5"
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            {featuredProducts.map((product) => (
                                <Pressable
                                    key={product.id}
                                    className="bg-white rounded-2xl mr-4 w-[260px] shadow-md overflow-hidden"
                                    onPress={() => {
                                        const productDetail =
                                            JSON.stringify(product);
                                        router.push({
                                            pathname: "/product/[id]",
                                            params: {
                                                id: product.id,
                                                productDetail: productDetail,
                                            },
                                        });
                                    }}
                                >
                                    <View className="relative">
                                        <Image
                                            source={{
                                                uri: product.images[0].imageUrl,
                                            }}
                                            className="w-full h-52"
                                            style={{ resizeMode: "cover" }}
                                        />

                                        {product &&
                                            product.discount != null &&
                                            product.discount > 0 && (
                                                <View className="absolute top-0 right-0">
                                                    <LinearGradient
                                                        colors={[
                                                            "#f43f5e",
                                                            "#e11d48",
                                                        ]}
                                                        className="px-3 py-2 rounded-bl-2xl"
                                                    >
                                                        <Text className="text-white text-xs font-bold">
                                                            -
                                                            {Math.round(
                                                                product.discount *
                                                                    100
                                                            )}
                                                            %
                                                        </Text>
                                                    </LinearGradient>
                                                </View>
                                            )}

                                        {/* Category Badge */}
                                        {product.categories.length > 0 && (
                                            <View className="absolute top-3 left-3 bg-white/80 rounded-full px-3 py-1 shadow-sm">
                                                <Text className="text-blue-700 text-xs font-medium">
                                                    {product.categories[0].name}
                                                </Text>
                                            </View>
                                        )}

                                        {/* Rating Badge */}
                                        <View className="absolute bottom-3 right-3 flex-row items-center bg-black/40 rounded-full px-2 py-1">
                                            <MaterialIcons
                                                name="star"
                                                size={14}
                                                color="#FBBF24"
                                            />
                                            <Text className="ml-1 text-white text-xs font-medium">
                                                {product.averageRating === 0
                                                    ? 5
                                                    : product.averageRating}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="px-4 py-2">
                                        <Text
                                            className="font-bold text-gray-800 text-base"
                                            numberOfLines={1}
                                        >
                                            {product.name}
                                        </Text>

                                        <Text
                                            className="text-gray-500 text-xs mt-1 mb-2"
                                            numberOfLines={2}
                                        >
                                            {product.description ||
                                                "Sản phẩm chất lượng cao từ Koine"}
                                        </Text>

                                        <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-between">
                                            {product.discount ? (
                                                <View>
                                                    <Text className="text-gray-400 text-xs line-through">
                                                        {product.price.toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                        ₫
                                                    </Text>
                                                    <Text className="font-bold text-blue-600 text-lg">
                                                        {(
                                                            product.price *
                                                            (1 -
                                                                product.discount)
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                        ₫
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text className="font-bold text-blue-600 text-lg">
                                                    {product.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </Text>
                                            )}

                                            <Pressable className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center shadow-sm">
                                                <MaterialIcons
                                                    name="shopping-cart"
                                                    size={18}
                                                    color="white"
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="mx-5 bg-white rounded-2xl py-10 items-center shadow-sm">
                            <MaterialIcons
                                name="shopping-bag"
                                size={48}
                                color="#CBD5E1"
                            />
                            <Text className="text-gray-400 mt-3 text-center">
                                Chưa có sản phẩm nào
                            </Text>
                            <Text className="text-gray-400 text-xs text-center mt-1">
                                Các sản phẩm sẽ được hiển thị tại đây
                            </Text>
                        </View>
                    )}
                </View>

                {/* Bottom Padding */}
                <View className="h-24" />
            </ScrollView>
        </View>
    );
}
