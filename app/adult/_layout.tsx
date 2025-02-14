import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function AdultLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="courses/[id]" />
        <Stack.Screen name="courses/[courseId]/lessons/[lessonId]" />
        <Stack.Screen name="notifications" />
      </Stack>
    </View>
  );
}
