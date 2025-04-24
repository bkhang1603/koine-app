import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRegisterMutation } from "@/queries/useAuth";

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dob, setDob] = useState("2000-10-20");
    const [date, setDate] = useState(new Date(2000, 9, 20));
    const [show, setShow] = useState(false);
    

    const nowUtc = new Date(); // Lấy thời gian hiện tại theo UTC
    const nowGmt7 = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ để đúng với GMT+7

    // Tính ngày giới hạn tuổi
    const minDate = new Date(
        nowGmt7.getFullYear() - 60,
        nowGmt7.getMonth(),
        nowGmt7.getDate()
    ); // Lớn nhất 60 tuổi
    const maxDate = new Date(
        nowGmt7.getFullYear() - 18,
        nowGmt7.getMonth(),
        nowGmt7.getDate()
    ); // Nhỏ nhất 18 tuổi

    const register = useRegisterMutation();

    function convertDateFormat(dateStr: string): string {
        // Tạo Date object từ chuỗi ISO 8601
        const [month, day, year] = dateStr.split("/");
        return `${day}/${month}/${year}`;
    }

    function convertToSubmit(dateStr: string): string {
        // Tạo Date object từ chuỗi ISO 8601
        const [day, month, year] = dateStr.split("/");
        return `${year}-${day}-${month}`;
    }

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShow(Platform.OS === "ios"); // Ẩn picker nếu là Android
        if (!selectedDate) return;
        setDate(selectedDate);
        const submitDate = convertDateFormat(selectedDate.toLocaleDateString());
        setDob(submitDate);
    };

    const handleRegister = async () => {
        try {
            if(isProcessing) return;
            setIsProcessing(true)
            // Validate form
            if (
                !name.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim() ||
                !dob ||
                !gender.trim() ||
                !address.trim()
            ) {
                Alert.alert(
                    "Lỗi",
                    "Vui lòng nhập đầy đủ thông tin, không được để trống!",
                    [
                        {
                            text: "tắt",
                            style: "cancel",
                        },
                    ]
                );
                setIsProcessing(false);
                return;
            }

            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            const isValidPassword = (password: string) =>
                passwordRegex.test(password);

            if (!isValidPassword(password)) {
                Alert.alert(
                    "Lỗi",
                    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                    [{ text: "tắt", style: "cancel" }]
                );
                setIsProcessing(false);
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp!", [
                    {
                        text: "tắt",
                        style: "cancel",
                    },
                ]);
                setIsProcessing(false);
                return;
            }

            const body = {
                email: email.trim(),
                username: name.trim(),
                password: password.trim(),
                gender: gender,
                address: address.trim(),
                dob: convertToSubmit(dob).trim(),
                role: "ADULT",
            };
            console.log(body)
            const res = await register.mutateAsync(body);
            if (res) {
                Alert.alert(
                    "Thông báo",
                    "Đăng kí thành công, kiểm tra mail để lấy mã xác nhận",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // Chuyển đến màn hình xác nhận OTP với ID từ response
                                router.push({
                                    pathname: "/(auth)/OTPConfirmation",
                                    params: { userId: res.data },
                                });
                            },
                        },
                    ]
                );
                setIsProcessing(false);
            }
        } catch (error) {
            Alert.alert("Lỗi", `${error}`, [
                {
                    text: "tắt",
                    style: "cancel",
                },
            ]);
            setIsProcessing(false);
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
                                Tạo tài khoản mới
                            </Text>
                            <Text className="text-gray-600 text-center px-10 text-base mt-1">
                                Hãy điền thông tin của bạn để bắt đầu
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="flex-1">
                        <View className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 flex-1">
                            <View className="space-y-5 flex-1">
                                {/* Name & Email Row */}
                                <View className="space-y-5">
                                    <View>
                                        <Text className="text-gray-700 font-medium mb-2 ml-1">
                                            Tên đăng nhập
                                        </Text>
                                        <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                            <MaterialIcons
                                                name="person"
                                                size={20}
                                                color="#6B7280"
                                            />
                                            <TextInput
                                                className="flex-1 py-3.5 px-3"
                                                placeholder="Nhập tên đăng nhập"
                                                value={name}
                                                onChangeText={setName}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-gray-700 font-medium mb-2 ml-1">
                                            Email
                                        </Text>
                                        <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                            <MaterialIcons
                                                name="email"
                                                size={20}
                                                color="#6B7280"
                                            />
                                            <TextInput
                                                className="flex-1 py-3.5 px-3"
                                                placeholder="Nhập email"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Address Input */}
                                <View>
                                    <Text className="text-gray-700 font-medium mb-2 ml-1">
                                        Địa chỉ
                                    </Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                        <MaterialIcons
                                            name="location-on"
                                            size={20}
                                            color="#6B7280"
                                        />
                                        <TextInput
                                            className="flex-1 py-3.5 px-3"
                                            placeholder="Nhập địa chỉ"
                                            value={address}
                                            onChangeText={setAddress}
                                        />
                                    </View>
                                </View>

                                {/* Date Picker */}
                                <View>
                                    <Text className="text-gray-700 font-medium mb-2 ml-1">
                                        Ngày sinh
                                    </Text>
                                    <View className="flex-row items-center space-x-3">
                                        <View className="flex-1 bg-gray-50 py-3.5 px-4 rounded-2xl border border-gray-100">
                                            <Text className="text-gray-700">
                                                {date.toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <Pressable
                                            className="bg-blue-100 p-4 rounded-2xl"
                                            onPress={() => setShow(true)}
                                        >
                                            <MaterialIcons
                                                name="calendar-today"
                                                size={20}
                                                color="#2563EB"
                                            />
                                        </Pressable>
                                    </View>
                                    {show && (
                                        <DateTimePicker
                                            value={date}
                                            mode="date"
                                            display="default"
                                            onChange={onChange}
                                            minimumDate={minDate}
                                            maximumDate={maxDate}
                                        />
                                    )}
                                </View>

                                {/* Gender Selection */}
                                <View>
                                    <Text className="text-gray-700 font-medium mb-2 ml-1">
                                        Giới tính
                                    </Text>
                                    <View className="flex-row space-x-4">
                                        <Pressable
                                            className={`flex-1 flex-row items-center justify-center py-3.5 rounded-2xl border ${
                                                gender === "MALE"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 bg-gray-50"
                                            }`}
                                            onPress={() => setGender("MALE")}
                                        >
                                            <MaterialIcons
                                                name="male"
                                                size={20}
                                                color={
                                                    gender === "MALE"
                                                        ? "#2563EB"
                                                        : "#6B7280"
                                                }
                                            />
                                            <Text
                                                className={`ml-2 font-medium ${
                                                    gender === "MALE"
                                                        ? "text-blue-500"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                Nam
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            className={`flex-1 flex-row items-center justify-center py-3.5 rounded-2xl border ${
                                                gender === "FEMALE"
                                                    ? "border-pink-500 bg-pink-50"
                                                    : "border-gray-200 bg-gray-50"
                                            }`}
                                            onPress={() => setGender("FEMALE")}
                                        >
                                            <MaterialIcons
                                                name="female"
                                                size={20}
                                                color={
                                                    gender === "FEMALE"
                                                        ? "#EC4899"
                                                        : "#6B7280"
                                                }
                                            />
                                            <Text
                                                className={`ml-2 font-medium ${
                                                    gender === "FEMALE"
                                                        ? "text-pink-500"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                Nữ
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Password Inputs */}
                                <View className="space-y-5 mb-6">
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
                                                placeholder="Nhập mật khẩu"
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry={!showPassword}
                                                autoCapitalize="none"
                                            />
                                            <Pressable
                                                onPress={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
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

                                    <View>
                                        <Text className="text-gray-700 font-medium mb-2 ml-1">
                                            Xác nhận mật khẩu
                                        </Text>
                                        <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                            <MaterialIcons
                                                name="lock"
                                                size={20}
                                                color="#6B7280"
                                            />
                                            <TextInput
                                                className="flex-1 py-3.5 px-3"
                                                placeholder="Nhập lại mật khẩu"
                                                value={confirmPassword}
                                                onChangeText={
                                                    setConfirmPassword
                                                }
                                                secureTextEntry={
                                                    !showConfirmPassword
                                                }
                                                autoCapitalize="none"
                                            />
                                            <Pressable
                                                onPress={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                <MaterialIcons
                                                    name={
                                                        showConfirmPassword
                                                            ? "visibility"
                                                            : "visibility-off"
                                                    }
                                                    size={20}
                                                    color="#6B7280"
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>

                                {/* Register Button */}
                                <Pressable
                                    className={`py-4 rounded-2xl items-center justify-center shadow-sm ${
                                        !isProcessing &&
                                        name &&
                                        dob &&
                                        gender &&
                                        password &&
                                        confirmPassword &&
                                        address &&
                                        email
                                            ? "bg-blue-600 active:bg-blue-700"
                                            : "bg-gray-200"
                                    }`}
                                    onPress={handleRegister}
                                    disabled={isProcessing}
                                >
                                    <Text
                                        className={`text-white font-bold text-base ${
                                            !isProcessing &&
                                            name &&
                                            dob &&
                                            gender &&
                                            password &&
                                            confirmPassword &&
                                            address &&
                                            email
                                                ? "text-white"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {isProcessing
                                            ? "Đang xử lý..."
                                            : "Tạo tài khoản"}
                                    </Text>
                                </Pressable>

                                {/* Login Link */}
                                <Pressable
                                    className="mt-4"
                                    onPress={() => router.push("/(auth)/login")}
                                >
                                    <Text className="text-center text-gray-600">
                                        Đã có tài khoản?{" "}
                                        <Text className="text-blue-600 font-medium">
                                            Đăng nhập
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
