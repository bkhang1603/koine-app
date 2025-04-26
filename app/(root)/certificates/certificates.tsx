import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useAppStore } from "@/components/app-provider";
import { useMyCertificates } from "@/queries/useUser";
import { useFocusEffect } from "expo-router";

const CERTIFICATES = [
  {
    id: "1",
    courseTitle: "Hiểu về cơ thể trong giai đoạn dậy thì",
    issueDate: "15/03/2024",
    instructor: "TS. Nguyễn Thị A",
    thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
    grade: "Xuất sắc",
    score: 95,
  },
  {
    id: "2",
    courseTitle: "Kỹ năng giao tiếp cho tuổi teen",
    issueDate: "10/03/2024",
    instructor: "ThS. Trần Văn B",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    grade: "Giỏi",
    score: 85,
  },
];

export default function CertificatesScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;
  const {
    data: myCertificate,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyCertificates({ token });

  useFocusEffect(() => {
    refetch();
  });

  if (isLoading) console.log("Certificate loading");
  if (isError) console.log("Certificate error ", error);

  console.log("certificate data ", myCertificate?.data);

  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack title="Chứng chỉ" returnTab={"/(tabs)/profile/profile"} />

      <ScrollView>
        <View className="p-4">
          {CERTIFICATES.map((cert) => (
            <View
              key={cert.id}
              className="bg-white rounded-2xl mb-4 border border-gray-100 overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Image source={{ uri: cert.thumbnail }} className="w-full h-40" />
              <View className="p-4">
                <Text className="text-lg font-bold">{cert.courseTitle}</Text>

                <View className="flex-row items-center mt-2">
                  <MaterialIcons name="person" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">{cert.instructor}</Text>
                </View>

                <View className="flex-row items-center justify-between mt-3">
                  <View className="flex-row items-center">
                    <MaterialIcons name="event" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">
                      Cấp ngày: {cert.issueDate}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={16} color="#FCD34D" />
                    <Text className="text-gray-700 ml-1 font-medium">
                      {cert.grade} ({cert.score}/100)
                    </Text>
                  </View>
                </View>

                <View className="flex-row mt-4">
                  <Pressable className="flex-1 flex-row items-center justify-center py-3 bg-blue-50 rounded-xl mr-2">
                    <MaterialIcons name="download" size={20} color="#3B82F6" />
                    <Text className="ml-2 font-medium text-blue-500">
                      Tải về
                    </Text>
                  </Pressable>
                  <Pressable className="flex-1 flex-row items-center justify-center py-3 bg-blue-500 rounded-xl ml-2">
                    <MaterialIcons name="share" size={20} color="#FFFFFF" />
                    <Text className="ml-2 font-medium text-white">Chia sẻ</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
