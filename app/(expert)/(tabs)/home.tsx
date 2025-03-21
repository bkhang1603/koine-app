import { useAppStore } from "@/components/app-provider";
import { useUserProfile } from "@/queries/useUser";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const accessToken = useAppStore((state) => state.accessToken);
  const token = accessToken == undefined ? "" : accessToken.accessToken;

  const profile = useAppStore((state) => state.profile);
  const {
    data: profileData,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useUserProfile({ token: token ? token : "", enabled: true });

  useEffect(() => {
    refetchProfile();
  }, [token]);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView>
        {/* Header with Avatar */}
        <View className="px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">
              Xin chào, {profile?.data.firstName}!
            </Text>
            <Text className="text-gray-600 mt-1">Hôm nay bạn muốn học gì?</Text>
          </View>
          {/* Cart and Notifications */}
          <View className="flex-row items-center">
            <Pressable
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 ml-2"
              onPress={() =>
                router.push("/(expert)/route/notifications/notifications")
              }
            >
              <MaterialIcons name="notifications" size={24} color="#374151" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
      <Text> Home của expert</Text>
    </View>
  );
}
