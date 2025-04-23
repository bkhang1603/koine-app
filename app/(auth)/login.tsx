import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useLoginMutation } from "@/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import * as SecureStore from "expo-secure-store";
import { RoleValues } from "@/constants/type";
import { Alert } from "react-native";
import * as Device from "expo-device";

export default function LoginScreen() {
    const getDeviceId = () => {
        return Device.osBuildId || Device.osInternalBuildId || "unknown";
    };

    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isClicked, setIsClicked] = useState(false);

    const { showModal: queryShowModal, expired } = useLocalSearchParams();

    const signIn = useLoginMutation();
    const setUser = useAppStore((state) => state.setUser);
    const setAccessToken = useAppStore((state) => state.setAccessToken);
    const setAccessExpired = useAppStore((state) => state.setAccessExpired);
    const setRefreshToken = useAppStore((state) => state.setRefreshToken);
    const setRefreshExpired = useAppStore((state) => state.setRefreshExpired);

    useEffect(() => {
        if (queryShowModal === "true") {
            if (expired === "true") {
                setModalMessage(
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                );
            } else if (expired === "false") {
                setModalMessage("Tài khoản đã được đăng nhập ở nơi khác.");
            } else {
                setModalMessage("Vui lòng đăng nhập lại.");
            }

            setShowModal(true);

            // Tự động đóng modal sau 3 giây
            const timeout = setTimeout(() => {
                setShowModal(false);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [queryShowModal, expired]);

    const handleLogin = async () => {
        try {
            const deviceId = getDeviceId() || "";
            if (email == "" || password == "") {
                Alert.alert(
                    "Thông báo",
                    "Vui lòng nhập tài khoản, mật khẩu đầy đủ!",
                    [
                        {
                            text: "tắt",
                            style: "cancel",
                        },
                    ]
                );
            }
            if (isProcessing) return;
            setIsProcessing(true);
            Keyboard.dismiss();
            const res = await signIn.mutateAsync({
                loginKey: email.trim(),
                password: password.trim(),
                deviceId: deviceId,
            });
            if (res?.statusCode == 200) {
                const {
                    accessToken,
                    refreshToken,
                    expiresAccess,
                    expiresRefresh,
                    account,
                } = res.data;
                setUser(account);
                setAccessToken({ accessToken, expiresAccess });
                setRefreshToken({ refreshToken, expiresRefresh });
                setAccessExpired(false);
                setRefreshExpired(false);

                // Lưu thông tin người dùng vào SecureStore
                const userString = JSON.stringify(res.data);
                await SecureStore.setItemAsync("loginData", userString); // Lưu trữ vào SecureStore

                if (account.role == RoleValues[0]) {
                    router.push("/(tabs)/home");

                    setTimeout(() => setIsProcessing(false), 1000);
                } else if (account.role == RoleValues[3]) {
                    router.push("/child/(tabs)/home");
                    setTimeout(() => setIsProcessing(false), 1000);
                } else if (account.role == RoleValues[1]) {
                    router.push("/(expert)/menu/home");

                    setTimeout(() => setIsProcessing(false), 1000);
                }
            }
        } catch (error) {
            Alert.alert("Lỗi", "Sai tên đăng nhập hoặc mật khẩu", [
                {
                    text: "tắt",
                    style: "cancel",
                },
            ]);
            setIsProcessing(false);
            console.log(error);
        }
    };

    const handleLoginByGoogle = () => {
        try {
            if (isClicked) return;
            setIsClicked(true);
            Alert.alert("Thông báo", "Đăng nhập bằng google đang chạy", [
                {
                    text: "tắt",
                    style: "cancel",
                },
            ]);
            setTimeout(() => setIsClicked(false), 1000);
        } catch (error) {
            console.log("Lỗi khi đăng nhập bằng google ", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    {showModal && (
                        <View className="absolute top-8 left-5 right-5 bg-white p-4 rounded-xl shadow-lg z-50">
                            <Text className="text-gray-800 text-center font-medium">
                                {modalMessage}
                            </Text>
                        </View>
                    )}

                    {/* Creative Header Design */}
                    <View className="h-72">
                        <View className="absolute top-0 left-0 right-0 h-88 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-b-[50px]" />

                        <View className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 opacity-20 rounded-full -mr-10 -mt-10" />
                        <View className="absolute top-20 left-0 w-20 h-20 bg-blue-300 opacity-20 rounded-full -ml-10" />

                        <View className="relative pt-12 items-center">
                            <View className="bg-white p-4 rounded-2xl shadow-xl">
                                <Image
                                    source={require("../../assets/images/logoKoine.png")}
                                    className="w-16 h-16"
                                    resizeMode="contain"
                                />
                            </View>

                            <Text className="text-3xl font-bold text-black mt-5 drop-shadow-lg">
                                Chào mừng trở lại!
                            </Text>
                            <Text className="text-gray-600 text-center px-10 text-base mt-1">
                                Vui lòng đăng nhập để tiếp tục
                            </Text>
                        </View>
                    </View>

                    <View className="flex-1">
                        <View className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 flex-1">
                            {/* Form */}
                            <View className="space-y-5 flex-1">
                                {/* Email Input */}
                                <View>
                                    <Text className="text-gray-700 font-medium mb-2 ml-1">
                                        Tài khoản
                                    </Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                        <MaterialIcons
                                            name="email"
                                            size={20}
                                            color="#6B7280"
                                        />
                                        <TextInput
                                            className="flex-1 py-3.5 px-3"
                                            placeholder="Nhập email của bạn"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                {/* Password Input */}
                                <View>
                                    <Text className="text-gray-700 font-medium mb-2 ml-1">
                                        Mật khẩu
                                    </Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                        <MaterialIcons
                                            name="lock"
                                            size={20}
                                            color="#6B7280"
                                        />
                                        <TextInput
                                            className="flex-1 py-3.5 px-3"
                                            placeholder="Nhập mật khẩu của bạn"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                        <Pressable
                                            onPress={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            <MaterialIcons
                                                name={
                                                    showPassword
                                                        ? "visibility"
                                                        : "visibility-off"
                                                }
                                                size={20}
                                                color="#6B7280"
                                            />
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Forgot Password */}
                                <Pressable className="self-end">
                                    <Text className="text-blue-600 font-medium">
                                        Quên mật khẩu?
                                    </Text>
                                </Pressable>

                                {/* Login Button */}
                                <Pressable
                                    className={`${
                                        isProcessing
                                            ? "bg-blue-600/60"
                                            : "bg-blue-600 active:bg-blue-700"
                                    } py-4 rounded-2xl mt-4 items-center justify-center shadow-sm`}
                                    onPress={handleLogin}
                                    disabled={isProcessing}
                                >
                                    <Text className="text-white font-bold text-base">
                                        {isProcessing
                                            ? "Đang xử lý..."
                                            : "Đăng nhập"}
                                    </Text>
                                </Pressable>

                                {/* Divider */}
                                <View className="flex-row items-center">
                                    <View className="flex-1 h-[1px] bg-gray-200" />
                                    <Text className="mx-4 text-gray-500">
                                        Hoặc
                                    </Text>
                                    <View className="flex-1 h-[1px] bg-gray-200" />
                                </View>

                                {/* Google Login */}
                                <TouchableOpacity
                                    onPress={handleLoginByGoogle}
                                    disabled={isClicked}
                                    className={`${
                                        isClicked ? "bg-gray-100" : "bg-white"
                                    } flex-row items-center justify-center border border-gray-100 rounded-2xl py-4`}
                                >
                                    <Image
                                        source={require("../../assets/images/google-logo.png")}
                                        className="w-5 h-5 mr-3"
                                    />
                                    <Text className="text-gray-700 font-semibold text-center text-base">
                                        {isClicked
                                            ? "Đang xử lý..."
                                            : "Tiếp tục với Google"}
                                    </Text>
                                </TouchableOpacity>

                                {/* Register Link - Moved to bottom */}
                                <Pressable
                                    className="mt-4"
                                    onPress={() =>
                                        router.push("/(auth)/register")
                                    }
                                >
                                    <Text className="text-center text-gray-600">
                                        Chưa có tài khoản?{" "}
                                        <Text className="text-blue-600 font-medium">
                                            Đăng ký ngay
                                        </Text>
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
