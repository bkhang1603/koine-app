import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";
import { Foundation, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "@/components/app-provider";
import { GetAllProductResType } from "@/schema/product-schema";
import { Animated } from "react-native";
import { useCreateCartItemMutation } from "@/queries/useCart";
import CartButton from "@/components/CartButton";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import HeaderWithBack from "@/components/HeaderWithBack";

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

export default function ProductDetailScreen() {
    const { id, productDetail } = useLocalSearchParams();

    let parsedProductDetail: GetAllProductResType["data"][0];
    const insets = useSafeAreaInsets();
    const [quantity, setQuantity] = useState(1);
    const shakeAnimation = new Animated.Value(0);
    const [isProcessing, setProcessing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const accessToken = useAppStore((state) => state.accessToken);
    const token = accessToken == undefined ? "" : accessToken.accessToken;

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const createCartItemMutation = useCreateCartItemMutation();
    const handleAddToCart = async () => {
        try {
            if (isProcessing) return;
            setProcessing(true);

            const res = await createCartItemMutation.mutateAsync({
                body: {
                    productId: id as string,
                    quantity: quantity,
                },
                token,
            });
            Alert.alert("Thông báo", "Thêm sản phẩm vào giỏ thành công", [
                {
                    text: "Mua tiếp",
                    style: "cancel",
                },
                {
                    text: "Trang chủ",
                    onPress: () => {
                        router.push("/(tabs)/home");
                    },
                    style: "destructive",
                },
            ]);
        } catch (e) {
            Alert.alert("Lỗi", `Không thêm được sản phẩm ${e}`, [
                {
                    text: "tắt",
                    style: "cancel",
                },
            ]);
        } finally {
            setProcessing(false);
        }
    };

    // Màn hình lỗi khi không thể parse sản phẩm
    if (typeof productDetail !== "string") {
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
                                    router.push("/(root)/product/product")
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
                                Chi tiết sản phẩm
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
                        name="error-outline"
                        size={64}
                        color="#9CA3AF"
                    />
                    <Text className="text-gray-500 text-lg mt-4 text-center">
                        Không tìm thấy thông tin sản phẩm
                    </Text>
                    <Pressable
                        className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                        onPress={() => router.push("/(root)/product/product")}
                    >
                        <Text className="text-white font-bold">
                            Quay lại danh sách
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

    try {
        // Parse thông tin sản phẩm
        parsedProductDetail = JSON.parse(
            decodeURIComponent(productDetail)
        ) as GetAllProductResType["data"][0];

        return (
            <View className="flex-1 bg-[#f5f7f9]">
                <StatusBar style="dark" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    {/* Header Image với Gradient Overlay */}
                    <View className="relative">
                        <Image
                            source={{
                                uri: parsedProductDetail.images[0].imageUrl,
                            }}
                            className="w-full h-72"
                            style={{ resizeMode: "cover" }}
                        />
                        <LinearGradient
                            colors={["rgba(0,0,0,0.7)", "transparent"]}
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 100,
                            }}
                        />

                        {/* Back button, cart và more options button */}
                        <View
                            style={{ paddingTop: insets.top }}
                            className="absolute top-0 left-0 right-0 z-10"
                        >
                            <View className="px-4 py-3 flex-row items-center justify-between">
                                <Pressable
                                    onPress={() =>
                                        router.push("/(root)/product/product")
                                    }
                                    className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                                >
                                    <MaterialIcons
                                        name="arrow-back"
                                        size={22}
                                        color="white"
                                    />
                                </Pressable>

                                <View className="flex-row items-center">
                                    <CartButton
                                        bgColor="bg-black/30"
                                        iconColor="white"
                                    />
                                    <Pressable
                                        className="w-10 h-10 items-center justify-center rounded-full bg-black/30 ml-2 mr-2"
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
                                        className="w-10 h-10 items-center justify-center rounded-full bg-black/30"
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
                        </View>

                        {/* Discount badge nếu có */}
                        {parsedProductDetail.discount != null &&
                            parsedProductDetail.discount > 0 && (
                                <View className="absolute top-6 right-4 bg-red-500 rounded-full px-3 py-2 z-10">
                                    <Text className="text-white font-bold">
                                        -
                                        {Math.round(
                                            parsedProductDetail.discount * 100
                                        )}
                                        %
                                    </Text>
                                </View>
                            )}
                    </View>

                    {/* Content */}
                    <View className="bg-white -mt-6 rounded-t-3xl px-5 pt-6 pb-24">
                        {/* Categories */}
                        <View className="flex-row flex-wrap gap-2 mb-3">
                            {parsedProductDetail.categories.map((category) => (
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

                        {/* Product Title */}
                        <Text className="text-2xl font-bold text-gray-800 mb-2">
                            {parsedProductDetail.name}
                        </Text>

                        {/* Rating and Price Section */}
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <View className="flex-row items-center mr-3">
                                    <MaterialIcons
                                        name="star"
                                        size={18}
                                        color="#F59E0B"
                                    />
                                    <Text className="ml-1 text-gray-700 font-medium">
                                        {parsedProductDetail.averageRating === 0
                                            ? 5
                                            : parsedProductDetail.averageRating}
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-sm">
                                    {parsedProductDetail.createdAtFormatted?.split(
                                        "-"
                                    )[1] || "Sản phẩm mới"}
                                </Text>
                            </View>

                            <View className="items-end">
                                {parsedProductDetail.discount != null &&
                                    parsedProductDetail.discount > 0 && (
                                        <Text className="text-gray-400 line-through">
                                            {Math.round(
                                                parsedProductDetail.price /
                                                    (1 -
                                                        parsedProductDetail.discount)
                                            ).toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </Text>
                                    )}
                                <Text
                                    className={`text-xl font-bold ${
                                        parsedProductDetail.price === 0
                                            ? "text-green-500"
                                            : "text-blue-500"
                                    }`}
                                >
                                    {parsedProductDetail.price === 0
                                        ? "Miễn phí"
                                        : `${parsedProductDetail.price.toLocaleString(
                                              "vi-VN"
                                          )} ₫`}
                                </Text>
                            </View>
                        </View>

                        {/* Description */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold text-gray-800 mb-2">
                                Mô tả sản phẩm
                            </Text>
                            <Text className="text-gray-600 leading-5">
                                {parsedProductDetail.description}
                            </Text>
                        </View>

                        {/* Thông tin thêm */}
                        <View className="bg-gray-50 rounded-xl p-4 mb-6">
                            <View className="flex-row items-center mb-3">
                                <MaterialIcons
                                    name="info-outline"
                                    size={18}
                                    color="#3B82F6"
                                />
                                <Text className="text-gray-800 font-bold ml-2">
                                    Thông tin thêm
                                </Text>
                            </View>

                            <View className="space-y-2">
                                <View className="flex-row">
                                    <Text className="text-gray-500 w-1/3">
                                        Chất lượng:
                                    </Text>
                                    <Text className="text-gray-800 font-medium flex-1">
                                        Sản phẩm chính hãng
                                    </Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="text-gray-500 w-1/3">
                                        Bảo hành:
                                    </Text>
                                    <Text className="text-gray-800 font-medium flex-1">
                                        12 tháng
                                    </Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="text-gray-500 w-1/3">
                                        Giao hàng:
                                    </Text>
                                    <Text className="text-gray-800 font-medium flex-1">
                                        2-3 ngày làm việc
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Action */}
                <View
                    className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-5 pt-4"
                    style={{ paddingBottom: Math.max(insets.bottom + 8, 16) }}
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-gray-500 text-sm mb-1">
                                Tổng cộng
                            </Text>
                            <Text className="text-2xl font-bold text-blue-500">
                                {parsedProductDetail.price === 0
                                    ? "Miễn phí"
                                    : `${(
                                          parsedProductDetail.price * quantity
                                      ).toLocaleString("vi-VN")} ₫`}
                            </Text>
                        </View>

                        {parsedProductDetail.price > 0 && (
                            <View className="flex-row items-center bg-gray-100 rounded-xl overflow-hidden">
                                <Pressable
                                    className="w-10 h-10 items-center justify-center"
                                    onPress={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    disabled={quantity <= 1}
                                >
                                    <MaterialIcons
                                        name="remove"
                                        size={20}
                                        color={
                                            quantity <= 1
                                                ? "#9CA3AF"
                                                : "#374151"
                                        }
                                    />
                                </Pressable>
                                <Animated.Text
                                    className="mx-5 font-semibold"
                                    style={{
                                        transform: [
                                            { translateX: shakeAnimation },
                                        ],
                                    }}
                                >
                                    {quantity}
                                </Animated.Text>
                                <Pressable
                                    className="w-10 h-10 items-center justify-center"
                                    onPress={() => {
                                        if (quantity >= 3) {
                                            shake();
                                        } else {
                                            setQuantity(quantity + 1);
                                        }
                                    }}
                                    disabled={quantity >= 3}
                                >
                                    <MaterialIcons
                                        name="add"
                                        size={20}
                                        color={
                                            quantity >= 3
                                                ? "#9CA3AF"
                                                : "#374151"
                                        }
                                    />
                                </Pressable>
                            </View>
                        )}
                    </View>

                    <Pressable
                        className={`w-full py-4 rounded-xl flex-row items-center justify-center ${
                            isProcessing ? "bg-blue-400" : "bg-blue-500"
                        }`}
                        onPress={handleAddToCart}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <MaterialIcons
                                    name="shopping-cart"
                                    size={20}
                                    color="white"
                                />
                                <Text className="text-white font-bold text-base ml-2">
                                    Thêm vào giỏ hàng
                                </Text>
                            </>
                        )}
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
    } catch (error) {
        console.log("Lỗi ở product detail ", error);
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
                                    router.push("/(root)/product/product")
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
                                Chi tiết sản phẩm
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
                        name="error-outline"
                        size={64}
                        color="#9CA3AF"
                    />
                    <Text className="text-gray-500 text-lg mt-4 text-center">
                        Không thể hiển thị thông tin sản phẩm
                    </Text>
                    <Pressable
                        className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                        onPress={() => router.push("/(root)/product/product")}
                    >
                        <Text className="text-white font-bold">
                            Quay lại danh sách
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
}
