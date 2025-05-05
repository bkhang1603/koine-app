import React from 'react'
import { View, Text, ScrollView, Image, Pressable, Linking } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import HeaderWithBack from '@/components/HeaderWithBack'
import { useAppStore } from '@/components/app-provider'
import { useMyCertificates } from '@/queries/useUser'
import { useFocusEffect } from 'expo-router'
import { getMyCertificates } from '@/schema/user-schema'

export default function CertificatesScreen() {
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

  const handleDownload = async (certificateUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(certificateUrl)
      if (supported) {
        await Linking.openURL(certificateUrl)
      } else {
        console.error("Don't know how to open URI: " + certificateUrl)
      }
    } catch (error) {
      console.error('Error opening URL:', error)
    }
  }

  let certificates = null
  if (myCertificate && !isError) {
    const parsedResult = getMyCertificates.safeParse(myCertificate)
    if (parsedResult.success) {
      certificates = parsedResult.data.data
    } else {
      console.error('Validation errors:', parsedResult.error.errors)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack title="Chứng chỉ" returnTab={'/(tabs)/profile/profile'} />

      <ScrollView>
        <View className="p-4">
          {certificates?.map((cert) => (
            <View
              key={cert.courseId}
              className="bg-white rounded-2xl mb-4 border border-gray-100 overflow-hidden"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Image
                source={{ uri: cert.courseImageUrl }}
                className="w-full h-40"
              />
              <View className="p-4">
                <Text className="text-lg font-bold">{cert.courseTitle}</Text>

                <View className="flex-row items-center justify-between mt-3">
                  <View className="flex-row items-center">
                    <MaterialIcons name="event" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">
                      Cấp ngày: {cert.completedDate}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={16} color="#FCD34D" />
                    <Text className="text-gray-700 ml-1 font-medium">
                      {cert.score}/100
                    </Text>
                  </View>
                </View>

                <Pressable
                  className="mt-4 flex-row items-center justify-center py-3 bg-blue-500 rounded-xl"
                  onPress={() => handleDownload(cert.certificateUrl)}
                >
                  <MaterialIcons name="download" size={20} color="#FFFFFF" />
                  <Text className="ml-2 font-medium text-white">Tải về</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
