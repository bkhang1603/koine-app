import React, { useState, useEffect } from 'react'
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
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useLoginMutation } from '@/queries/useAuth'
import { useAppStore } from '@/components/app-provider'
import * as SecureStore from 'expo-secure-store'
import { RoleValues } from '@/constants/type'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isClicked, setIsClicked] = useState(false)

  const { showModal: queryShowModal, expired } = useLocalSearchParams()

  const signIn = useLoginMutation()
  const setUser = useAppStore((state) => state.setUser)
  const setAccessToken = useAppStore((state) => state.setAccessToken)
  const setAccessExpired = useAppStore((state) => state.setAccessExpired)
  const setRefreshToken = useAppStore((state) => state.setRefreshToken)
  const setRefreshExpired = useAppStore((state) => state.setRefreshExpired)

  useEffect(() => {
    if (queryShowModal === 'true') {
      if (expired === 'true') {
        setModalMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      } else if (expired === 'false') {
        setModalMessage('Tài khoản đã được đăng nhập ở nơi khác.')
      } else {
        setModalMessage('Vui lòng đăng nhập lại.')
      }

      setShowModal(true)

      // Tự động đóng modal sau 5 giây
      const timeout = setTimeout(() => {
        setShowModal(false)
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [queryShowModal, expired])

  const handleLogin = async () => {
    try {
      if (email == '' || password == '') {
        alert('Vui lòng nhập tài khoản, mật khẩu đầy đủ!')
      }
      if (isProcessing) return
      setIsProcessing(true)
      Keyboard.dismiss()
      const res = await signIn.mutateAsync({
        loginKey: email,
        password: password,
      })
      if (res?.statusCode == 200) {
        const {
          accessToken,
          refreshToken,
          expiresAccess,
          expiresRefresh,
          account,
        } = res.data
        setUser(account)
        setAccessToken({ accessToken, expiresAccess })
        setRefreshToken({ refreshToken, expiresRefresh })
        setAccessExpired(false)
        setRefreshExpired(false)

        // Lưu thông tin người dùng vào SecureStore
        const userString = JSON.stringify(res.data)
        await SecureStore.setItemAsync('loginData', userString) // Lưu trữ vào SecureStore

        if (account.role == RoleValues[0]) {
          router.push('/(tabs)/home')
        } else if (account.role == RoleValues[3]) {
          router.push('/child/(tabs)/home')
        }
      } else if (res?.statusCode == 400) {
        alert('Tài khoản chưa được kích hoạt')
      } else if (res?.statusCode == 404) {
        alert('Tài khoản không tồn tại hoặc sai tài khoản mật khẩu')
      } else {
        alert('Lỗi máy chủ. Vui lòng thử lại sau!')
      }
      setTimeout(() => setIsProcessing(false), 1000)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLoginByGoogle = () => {
    try {
      if (isClicked) return
      setIsClicked(true)
      alert('Login by google processing!')
      setTimeout(() => setIsClicked(false), 1000)
    } catch (error) {
      console.log('Lỗi khi đăng nhập bằng google ', error)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

          <View className="flex-1 justify-center px-6">
            {/* Logo */}
            <View className="items-center mb-10">
              <View className="w-24 h-24 bg-blue-50 rounded-3xl items-center justify-center">
                <MaterialIcons name="person" size={48} color="#2563EB" />
              </View>
            </View>

            {/* Title */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-800 text-center">
                Chào mừng trở lại!
              </Text>
              <Text className="text-gray-500 mt-2 text-center">
                Vui lòng đăng nhập để tiếp tục
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-5">
              {/* Email Input */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">
                  Tài khoản
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                  <MaterialIcons name="email" size={20} color="#6B7280" />
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
                <Text className="text-gray-700 font-medium mb-2">Mật khẩu</Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 border border-gray-200">
                  <MaterialIcons name="lock" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 py-3.5 px-3"
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
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
                    ? 'bg-gray-400'
                    : 'bg-blue-600 active:bg-blue-700'
                } py-4 rounded-xl mt-4`}
                onPress={handleLogin}
                disabled={isProcessing}
              >
                <Text className="text-white font-semibold text-center text-base">
                  {isProcessing ? 'Đang xử lý...' : 'Đăng nhập'}
                </Text>
              </Pressable>

              {/* Divider */}
              <View className="flex-row items-center">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-4 text-gray-500">Hoặc</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
              </View>

              {/* Google Login */}
              <TouchableOpacity
                onPress={handleLoginByGoogle}
                disabled={isClicked}
                className={`flex-row items-center justify-center border border-gray-200 rounded-xl py-4 ${
                  isClicked ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <Image
                  source={require('../../assets/images/google-logo.png')}
                  className="w-5 h-5 mr-3"
                />
                <Text className="text-gray-700 font-medium">
                  {isClicked ? 'Đang xử lý...' : 'Tiếp tục với Google'}
                </Text>
              </TouchableOpacity>

              {/* Register Link - Moved to bottom */}
              <Pressable
                className="mt-4"
                onPress={() => router.push('/(auth)/register')}
              >
                <Text className="text-center text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Text className="text-blue-600 font-medium">
                    Đăng ký ngay
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Bottom Padding */}
          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
