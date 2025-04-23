import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Modal } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GetAllProductResType, productRes } from "@/schema/product-schema";
import CartButton from "@/components/CartButton";
import { Foundation, MaterialIcons } from "@expo/vector-icons";
import { useAllProduct } from "@/queries/useProduct";
import { useAppStore } from "@/components/app-provider";
import { StatusBar } from "expo-status-bar";
import ActivityIndicatorScreen from "@/components/ActivityIndicatorScreen";
import HeaderWithBack from "@/components/HeaderWithBack";
import { LinearGradient } from "expo-linear-gradient";

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

export default function ProductsScreen() {
    const accessToken = useAppStore((state) => state.accessToken);
    const token = accessToken == undefined ? "" : accessToken.accessToken;
    const insets = useSafeAreaInsets();
    const [showMenu, setShowMenu] = useState(false);

    const profile = useAppStore((state) => state.profile);
    const firstName = profile?.data.firstName || "User";
    const firstName_Initial = firstName
        ? firstName.charAt(0).toUpperCase()
        : "K";

    const {
        data: productListData,
        isLoading: productListDataLoading,
        isError: productListDataError,
        refetch: refetchProductList,
    } = useAllProduct({
        token: token as string,
    });

    useFocusEffect(() => {
        refetchProductList();
    });

    if (productListDataLoading) {
        return <ActivityIndicatorScreen />;
    }

    let parsedProductList: GetAllProductResType["data"] = [];

    if (productListData) {
        const result = productRes.safeParse(productListData);
        if (result.success) {
            parsedProductList = result.data.data;
        } else {
            console.error("Product validation errors:", result.error.errors);
        }
    }

    // Màn hình khi không có sản phẩm
    if (!parsedProductList || parsedProductList.length === 0) {
        return (
            <View className="flex-1 bg-[#f5f7f9]">
                <StatusBar style="dark" />

                {/* Custom Gradient Header with Back Button and More Options */}
                <LinearGradient
                    colors={["#3b82f6", "#1d4ed8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="pt-14 pb-6 px-5"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() =>
                                    router.push("/(tabs)/profile/profile")
                                }
                                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                            >
                                <MaterialIcons
                                    name="arrow-back"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>
                            <Text className="text-white text-lg font-bold ml-4">
                                Danh sách sản phẩm
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Pressable
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
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

                            <Pressable
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                                onPress={() => setShowMenu(true)}
                            >
                                <MaterialIcons
                                    name="more-vert"
                                    size={22}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>

                <View className="flex-1 items-center justify-center p-4">
                    <MaterialIcons
                        name="shopping-cart"
                        size={64}
                        color="#9CA3AF"
                    />
                    <Text className="text-gray-500 text-lg mt-4 text-center">
                        Danh sách sản phẩm trống
                    </Text>
                    <Pressable
                        className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                        onPress={() => router.push("/(tabs)/home")}
                    >
                        <Text className="text-white font-bold">
                            Quay lại trang chủ
                        </Text>
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
                                    <Text className="ml-3 text-gray-700">
                                        {option.title}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
            </View>
        );
    }

    // Màn hình chính có sản phẩm
    return (
        <View className="flex-1 bg-[#f5f7f9]">
            <StatusBar style="dark" />

            {/* Custom Gradient Header with Back Button and More Options */}
            <LinearGradient
                colors={["#3b82f6", "#1d4ed8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="pt-14 pb-6 px-5"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Pressable
                            onPress={() =>
                                router.push("/(tabs)/profile/profile")
                            }
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <MaterialIcons
                                name="arrow-back"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                        <Text className="text-white text-lg font-bold ml-4">
                            Danh sách sản phẩm
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Pressable
                            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
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

                        <Pressable
                            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                            onPress={() => setShowMenu(true)}
                        >
                            <MaterialIcons
                                name="more-vert"
                                size={22}
                                color="white"
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Search Bar in Gradient Header */}
                <Pressable
                    className="flex-row items-center bg-white/20 rounded-xl p-3.5 mt-4"
                    onPress={() => router.push("/search/searchProduct")}
                >
                    <MaterialIcons name="search" size={20} color="white" />
                    <Text className="ml-2 text-white/80 flex-1">
                        Tìm kiếm sản phẩm...
                    </Text>
                </Pressable>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Featured Product */}
                {parsedProductList.length > 0 && (
                    <View className="px-5 mt-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold text-gray-800">
                                Sản phẩm nổi bật
                            </Text>
                            <Pressable className="flex-row items-center">
                                <Text className="text-blue-500 font-medium mr-1">
                                    Xem tất cả
                                </Text>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={20}
                                    color="#3B82F6"
                                />
                            </Pressable>
                        </View>

                        <Pressable
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                            onPress={() => {
                                const productDetail = JSON.stringify(
                                    parsedProductList[0]
                                );
                                router.push({
                                    pathname: "/product/[id]",
                                    params: {
                                        id: parsedProductList[0].id,
                                        productDetail: productDetail,
                                    },
                                });
                            }}
                        >
                            <View>
                                <Image
                                    source={{
                                        uri: parsedProductList[0].images[0]
                                            .imageUrl,
                                    }}
                                    className="w-full h-48 rounded-t-2xl"
                                    style={{ resizeMode: "cover" }}
                                />
                                {parsedProductList[0].discount != null &&
                                    parsedProductList[0].discount > 0 && (
                                        <View className="absolute top-3 right-3 bg-red-500 rounded-full px-2 py-1">
                                            <Text className="text-white font-bold text-xs">
                                                -
                                                {Math.round(
                                                    parsedProductList[0]
                                                        .discount * 100
                                                )}
                                                %
                                            </Text>
                                        </View>
                                    )}
                            </View>

                            <View className="p-4">
                                <View className="flex-row flex-wrap gap-2 mb-2">
                                    {parsedProductList[0].categories
                                        .slice(0, 2)
                                        .map((category) => (
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

                                <Text className="text-lg font-bold text-gray-800 mb-2">
                                    {parsedProductList[0].name}
                                </Text>

                                <Text
                                    className="text-gray-600 mb-3"
                                    numberOfLines={2}
                                >
                                    {parsedProductList[0].description}
                                </Text>

                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <MaterialIcons
                                            name="star"
                                            size={16}
                                            color="#F59E0B"
                                        />
                                        <Text className="ml-1 text-gray-700">
                                            {parsedProductList[0]
                                                .averageRating === 0
                                                ? 5
                                                : parsedProductList[0]
                                                      .averageRating}
                                        </Text>
                                    </View>

                                    <View>
                                        {parsedProductList[0].discount !=
                                            null &&
                                            parsedProductList[0].discount >
                                                0 && (
                                                <Text className="text-gray-400 line-through text-xs">
                                                    {Math.round(
                                                        parsedProductList[0]
                                                            .price /
                                                            (1 -
                                                                parsedProductList[0]
                                                                    .discount)
                                                    ).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    ₫
                                                </Text>
                                            )}
                                        <Text
                                            className={`font-bold ${
                                                parsedProductList[0].price === 0
                                                    ? "text-green-500"
                                                    : "text-blue-500"
                                            }`}
                                        >
                                            {parsedProductList[0].price === 0
                                                ? "Miễn phí"
                                                : `${parsedProductList[0].price.toLocaleString(
                                                      "vi-VN"
                                                  )} ₫`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                )}

                {/* All Products */}
                <View className="px-5 mt-8 pb-20">
                    <Text className="text-xl font-bold text-gray-800 mb-4">
                        Tất cả sản phẩm
                    </Text>

                    <View className="space-y-4">
                        {parsedProductList.map((product) => (
                            <Pressable
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-row h-32"
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
                                <View className="w-1/3 relative">
                                    <Image
                                        source={{
                                            uri: product.images[0].imageUrl,
                                        }}
                                        className="w-full h-full"
                                        style={{ resizeMode: "cover" }}
                                    />
                                    {product.discount != null &&
                                        product.discount > 0 && (
                                            <View className="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-1">
                                                <Text className="text-white font-bold text-xs">
                                                    -
                                                    {Math.round(
                                                        product.discount * 100
                                                    )}
                                                    %
                                                </Text>
                                            </View>
                                        )}
                                </View>

                                <View className="flex-1 p-3 justify-between">
                                    <View>
                                        <View className="flex-row flex-wrap gap-1 mb-1">
                                            {product.categories
                                                .slice(0, 1)
                                                .map((category) => (
                                                    <View
                                                        key={category.id}
                                                        className="bg-blue-50 px-2 py-0.5 rounded-full"
                                                    >
                                                        <Text className="text-blue-600 text-xs">
                                                            {category.name}
                                                        </Text>
                                                    </View>
                                                ))}
                                        </View>

                                        <Text
                                            className="font-bold text-gray-800"
                                            numberOfLines={2}
                                        >
                                            {product.name}
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <MaterialIcons
                                                name="star"
                                                size={14}
                                                color="#F59E0B"
                                            />
                                            <Text className="ml-1 text-xs text-gray-600">
                                                {product.averageRating === 0
                                                    ? 5
                                                    : product.averageRating}
                                            </Text>
                                        </View>

                                        <View>
                                            {product.discount != null &&
                                                product.discount > 0 && (
                                                    <Text className="text-gray-400 line-through text-xs text-right">
                                                        {Math.round(
                                                            product.price /
                                                                (1 -
                                                                    product.discount)
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}{" "}
                                                        ₫
                                                    </Text>
                                                )}
                                            <Text
                                                className={`font-bold ${
                                                    product.price === 0
                                                        ? "text-green-500"
                                                        : "text-blue-500"
                                                }`}
                                            >
                                                {product.price === 0
                                                    ? "Miễn phí"
                                                    : `${product.price.toLocaleString(
                                                          "vi-VN"
                                                      )} ₫`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
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
                                <Text className="ml-3 text-gray-700">
                                    {option.title}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
