import React from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import HeaderWithBack from '@/components/child/HeaderWithBack'
import { useAppStore } from '@/components/app-provider'
import { useMyCertificates } from '@/queries/useUser'
import { useFocusEffect } from 'expo-router'
import { getMyCertificates } from '@/schema/user-schema'

export default function AchievementsScreen() {
  const accessToken = useAppStore((state) => state.accessToken)
  const token = accessToken == undefined ? '' : accessToken.accessToken
  const {
    data: myCertificate,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyCertificates({ token })

  useFocusEffect(() => {
    refetch()
  })

  let certificates = null
  if (myCertificate && !isError) {
    const parsedResult = getMyCertificates.safeParse(myCertificate)
    if (parsedResult.success) {
      certificates = parsedResult.data.data
    } else {
      console.error('Validation errors:', parsedResult.error.errors)
    }
  }

  const totalCertificates = certificates?.length || 0
  const averageScore =
    certificates && totalCertificates > 0
      ? certificates.reduce((sum, cert) => sum + cert.score, 0) /
        totalCertificates
      : 0

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack title="Thành tích" />

      <ScrollView>
        {/* Stats Overview */}
        <View className="flex-row p-4">
          <View className="flex-1 bg-violet-50 rounded-xl p-4 mr-2">
            <MaterialIcons name="emoji-events" size={24} color="#7C3AED" />
            <Text className="text-2xl font-bold mt-2">{totalCertificates}</Text>
            <Text className="text-gray-600">Chứng chỉ</Text>
          </View>
          <View className="flex-1 bg-violet-50 rounded-xl p-4 ml-2">
            <MaterialIcons name="stars" size={24} color="#7C3AED" />
            <Text className="text-2xl font-bold mt-2">
              {averageScore.toFixed(1)}
            </Text>
            <Text className="text-gray-600">Điểm trung bình</Text>
          </View>
        </View>

        {/* Certificates List */}
        <View className="p-4">
          {certificates?.map((cert) => (
            <View
              key={cert.courseId}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="flex-row p-4">
                <View className="w-16 h-16 rounded-xl overflow-hidden mr-4">
                  <Image
                    source={{ uri: cert.courseImageUrl }}
                    className="w-full h-full"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold mb-1">
                    {cert.courseTitle}
                  </Text>
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons name="event" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">
                      {cert.completedDate}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={16} color="#FCD34D" />
                    <Text className="text-gray-700 ml-1 font-medium">
                      {cert.score}/100
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
