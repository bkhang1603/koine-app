import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function ExpertRouteLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="event/create-event" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="notifications/notifications" />
      </Stack>
    </View>
  );
}
